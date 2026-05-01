import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readStripeStore, writeStripeStore } from "./stripeStore.js";
import { findUserByEmail, findUserById, addUser, updateUser, getAllUsers, deleteUser, setUserRole } from "./userStore.js";
import { authMiddleware, adminMiddleware, generateToken, verifyToken } from "./authMiddleware.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const hasUsableSecretKey = Boolean(stripeSecretKey)
  && !stripeSecretKey.includes("${")
  && stripeSecretKey.startsWith("sk_");
const stripe = hasUsableSecretKey ? new Stripe(stripeSecretKey) : null;

app.use(express.json());

async function ensureProductAndPrice() {
  if (!stripe) {
    throw new Error("Missing STRIPE_SECRET_KEY. Add it to .env.local.");
  }

  const store = await readStripeStore();

  if (store.productId && store.priceId) {
    return store;
  }

  const product = await stripe.products.create({
    name: "Example Product",
    default_price_data: {
      currency: "usd",
      unit_amount: 2000
    }
  });

  const nextStore = await writeStripeStore({
    ...store,
    productId: product.id,
    priceId: product.default_price
  });

  return nextStore;
}

app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = await ensureProductAndPrice();
    const origin = req.headers.origin || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });

    res.json({
      id: session.id,
      url: session.url
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Stripe Checkout Session";

    if (!hasUsableSecretKey) {
      return res.status(503).json({
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY=sk_test_... in .env.local"
      });
    }

    if (message.toLowerCase().includes("invalid api key") || message.toLowerCase().includes("api key")) {
      return res.status(401).json({
        message: "Invalid Stripe secret key. Check STRIPE_SECRET_KEY in .env.local"
      });
    }

    res.status(500).json({ message });
  }
});

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        message: "Stripe webhook unavailable: missing STRIPE_SECRET_KEY"
      });
    }

    const event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], webhookSecret)
      : JSON.parse(req.body.toString());

    if (event.type === "checkout.session.completed") {
      const store = await readStripeStore();
      await writeStripeStore({
        ...store,
        lastCheckoutSessionCompleted: {
          id: event.data.object.id,
          created: event.created
        }
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Webhook signature verification failed"
    });
  }
});

app.get("/api/stripe/status", async (_req, res) => {
  const store = await readStripeStore();
  res.json({
    configured: hasUsableSecretKey,
    productId: store.productId,
    priceId: store.priceId,
    lastCheckoutSessionCompleted: store.lastCheckoutSessionCompleted
  });
});

// Feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email to admin
    const adminEmailOptions = {
      from: process.env.EMAIL_USER,
      to: "misgana21son@gmail.com",
      subject: `New Feedback from ${name}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${comment.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>This email was sent from the Dawalinqo Learning Platform</small></p>
      `
    };

    // Send admin email
    await transporter.sendMail(adminEmailOptions);

    // Optional: Send confirmation email to user
    const userEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for your feedback",
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We received your feedback and appreciate your input. We'll review it and continue improving Dawalinqo.</p>
        <p>Best regards,<br>The Dawalinqo Team</p>
      `
    };

    await transporter.sendMail(userEmailOptions);

    res.status(200).json({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ 
      message: "Failed to send feedback. Please check that EMAIL_USER and EMAIL_PASSWORD are configured."
    });
  }
});

// === Authentication Endpoints ===

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await addUser(newUser);

    // Generate token
    const token = generateToken(newUser.id, jwtSecret);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || "user"
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user.id, jwtSecret);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get Current User (protected route example)
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Update User Profile (protected route)
app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await updateUser(req.userId, { name });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Change Password (protected route)
app.post("/api/auth/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser(req.userId, { password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// === Admin Endpoints ===

// Get All Users (admin only)
app.get("/api/admin/users", adminMiddleware, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get User Details (admin only)
app.get("/api/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Delete User (admin only)
app.delete("/api/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Update User Role (admin only)
app.put("/api/admin/users/:id/role", adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await setUserRole(req.params.id, role);

    res.json({
      message: "User role updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: error.message || "Failed to update user role" });
  }
});

// Admin Check (check if user is admin)
app.get("/api/admin/check", authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      isAdmin: user.role === "admin",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Failed to check admin status" });
  }
});

app.listen(port, () => {
  console.log(`Stripe API server running on http://localhost:${port}`);
  if (!hasUsableSecretKey) {
    console.warn("Stripe is not fully configured. Set STRIPE_SECRET_KEY=sk_test_... in .env.local.");
  }
});
