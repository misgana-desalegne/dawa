# User Registration & Admin System Documentation

## Overview
This document describes the complete user registration, authentication, and admin management system implemented in the Dawakaunka learning platform.

## Features Implemented

### 1. User Authentication
- **User Registration** (`POST /api/auth/register`)
  - Create new user accounts with email and password
  - Password hashing with bcrypt
  - Email validation
  - Duplicate email prevention

- **User Login** (`POST /api/auth/login`)
  - Authenticate with email and password
  - JWT token generation (7-day expiration)
  - Returns user data with role information

- **Get Current User** (`GET /api/auth/me`)
  - Protected endpoint to retrieve current user info
  - Requires valid JWT token

- **Update Profile** (`PUT /api/auth/profile`)
  - Change user name
  - Protected endpoint

- **Change Password** (`POST /api/auth/change-password`)
  - Change account password
  - Requires current password verification
  - Protected endpoint

### 2. Admin Features

#### Admin Dashboard (`/admin`)
A comprehensive admin interface providing:
- **User Management**
  - View all registered users
  - Search users by name or email
  - View detailed user information
  - Delete users (with confirmation)
  
- **Role Management**
  - Promote/demote users between "user" and "admin" roles
  - Prevent self-role changes
  - Instant role updates

- **User Creation**
  - Create new users directly from admin panel
  - Set initial passwords

#### Admin API Endpoints

All admin endpoints require admin role and valid JWT token:

- **List Users** `GET /api/admin/users`
  - Returns all users with basic info
  - Authorization: Bearer {token}

- **Get User Details** `GET /api/admin/users/:id`
  - Returns detailed user information
  - Authorization: Bearer {token}

- **Delete User** `DELETE /api/admin/users/:id`
  - Removes user from system
  - Cannot delete self
  - Authorization: Bearer {token}

- **Update User Role** `PUT /api/admin/users/:id/role`
  - Change user role (user/admin)
  - Cannot change own role
  - Body: `{ "role": "admin" | "user" }`
  - Authorization: Bearer {token}

- **Admin Check** `GET /api/admin/check`
  - Verify if user is admin
  - Returns user data and admin status
  - Authorization: Bearer {token}

### 3. Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control (RBAC)**: Admin-only endpoints
- **Input Validation**: Email format, password requirements
- **Protected Routes**: Client-side route guards with ProtectedRoute component
- **Self-action Prevention**: Users cannot delete or modify their own admin status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  createdAt TEXT NOT NULL
)
```

**Fields:**
- `id`: UUID
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `role`: Either "user" or "admin"
- `createdAt`: ISO timestamp

## User Registration Flow

```
1. User visits /signup
2. Fills name, email, password, confirm password
3. Client validates passwords match
4. POST to /api/auth/register
5. Server validates all fields
6. Hash password with bcrypt
7. Create user record in database
8. Generate JWT token
9. Return token and user data
10. Client stores in localStorage
11. Redirect to home or close popup
```

## Admin Panel Access

```
1. User logs in
2. AuthContext stores user + role
3. Navigate to /admin
4. ProtectedRoute component checks:
   - User is authenticated
   - User has admin role
5. If not admin: redirect to /
6. AdminPage fetches user list via API
7. Display admin dashboard
```

## Key Files

### Backend
- `server/index.js` - Main server file with all endpoints
- `server/userStore.js` - Database operations and queries
- `server/authMiddleware.js` - JWT verification and admin middleware

### Frontend
- `src/context/AuthContext.jsx` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route protection component
- `src/pages/AdminPage.jsx` - Admin dashboard UI
- `src/pages/LoginPage.jsx` - Login form
- `src/pages/SignupPage.jsx` - Registration form
- `src/styles/admin.css` - Admin panel styles
- `src/App.jsx` - App setup with auth provider

## How to Use

### For Regular Users

1. **Sign Up**
   - Navigate to `/signup` or click "Create Account"
   - Fill in name, email, password
   - Click "Create Account"
   - Auto-redirects to home after successful registration

2. **Log In**
   - Navigate to `/login` or click "Log In"
   - Enter email and password
   - Click "Log In"
   - Auto-redirects to home after successful login

3. **Profile Management**
   - After login, go to account settings (if available)
   - Update name
   - Change password using current password verification

### For Admins

1. **Access Admin Dashboard**
   - Must be logged in as admin user
   - Navigate to `/admin`
   - Dashboard loads with user list

2. **Manage Users**
   - Search users by name/email
   - Click "View" to see user details
   - Click "Delete" to remove user (with confirmation)
   - Change user role from dropdown

3. **Create New User**
   - Click "Create User" tab
   - Fill form with name, email, password
   - New user created with "user" role by default

## Initializing the First Admin

To create the first admin user, add a special endpoint or manually:

```javascript
// Add to server/index.js - initialization endpoint
app.post("/api/init/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingAdmin = await getAllUsers();
    if (existingAdmin.some(u => u.role === "admin")) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date().toISOString()
    };
    
    await addUser(newAdmin);
    const token = generateToken(newAdmin.id, jwtSecret);
    
    res.status(201).json({
      message: "Admin created successfully",
      token,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin" });
  }
});
```

Or make the first registration user automatically admin:

```javascript
// In /api/auth/register endpoint
const newUser = {
  // ... other fields
  role: (await getAllUsers()).length === 0 ? "admin" : "user"
};
```

## Environment Variables

Required `.env.local` file in root:
```
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-jwt-secret-key-change-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Best Practices

1. **Password Security**
   - Minimum 6 characters enforced
   - Never store plain passwords
   - Always hash with bcrypt

2. **JWT Tokens**
   - 7-day expiration set
   - Change JWT_SECRET in production
   - Store securely in localStorage (httpOnly not supported in this setup)

3. **Admin Operations**
   - Prevent self-deletion
   - Prevent self-role changes
   - Require confirmation for destructive operations

4. **Error Handling**
   - Clear error messages to users
   - Proper HTTP status codes (400, 401, 403, 404, 500)
   - Logging of server errors

5. **Database**
   - Unique constraint on email
   - Default "user" role for new users
   - ISO timestamps for all records

## Testing

### Manual Testing Checklist

- [ ] User can register with new email
- [ ] Duplicate email prevented
- [ ] Password mismatch detected
- [ ] Password too short (< 6 chars) rejected
- [ ] User can login after registration
- [ ] JWT token generated and stored
- [ ] Protected routes redirect unauthenticated users
- [ ] Admin dashboard accessible only to admins
- [ ] Admin can view all users
- [ ] Admin can search users
- [ ] Admin can promote user to admin
- [ ] Admin can demote user to regular
- [ ] Admin can delete user
- [ ] Users cannot delete themselves
- [ ] Users cannot change their own role
- [ ] Password change works with verification

### API Testing with curl

```bash
# Register new user
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123","passwordConfirm":"password123"}'

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8787/api/auth/me

# List all users (admin only)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8787/api/admin/users

# Delete user (admin only)
curl -X DELETE http://localhost:8787/api/admin/users/user-id \
  -H "Authorization: Bearer TOKEN"
```

## Future Enhancements

1. **Email Verification**
   - Send verification email on signup
   - Require email confirmation before account activation

2. **Password Reset**
   - Forgot password functionality
   - Email-based password reset links

3. **Session Management**
   - Refresh tokens
   - Token revocation/logout
   - Session history

4. **Audit Logging**
   - Log admin actions
   - Track user registrations and logins
   - Monitor suspicious activities

5. **Two-Factor Authentication (2FA)**
   - SMS or authenticator app
   - Enhanced security for admin accounts

6. **User Roles & Permissions**
   - More granular role system
   - Permission-based access control
   - Teacher/instructor roles

7. **Admin Analytics**
   - User statistics and charts
   - Activity dashboard
   - Export user data

## Troubleshooting

**"Cannot find package better-sqlite3"**
- Already fixed! Using sql.js (pure JavaScript) instead

**Admin page redirects to home**
- User is not authenticated - login first
- User authenticated but doesn't have admin role

**Password change fails**
- Incorrect current password provided
- New password too short (< 6 chars)
- Passwords don't match

**Cannot delete user**
- Trying to delete yourself - use delete button from different admin account
- User ID doesn't exist

## Support

For issues or questions about the admin system, check:
1. Server logs (running terminal)
2. Browser console (DevTools F12)
3. Network requests (DevTools Network tab)
4. User data in localStorage

