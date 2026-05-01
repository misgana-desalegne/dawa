import jwt from "jsonwebtoken";
import { findUserById } from "./userStore.js";

export function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

export function generateToken(userId, secret, expiresIn = "7d") {
  return jwt.sign({ userId }, secret, { expiresIn });
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = verifyToken(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.userId = decoded.userId;
  next();
}

export async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = verifyToken(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await findUserById(decoded.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  req.userId = decoded.userId;
  req.user = user;
  next();
}
