import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "database.sqlite");

let db = null;

async function initDB() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      createdAt TEXT NOT NULL
    )
  `);
  
  // Add role column if it doesn't exist (for existing databases)
  try {
    db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
  } catch (e) {
    // Column already exists
  }
  
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Initialize DB immediately
await initDB();

export function findUserByEmail(email) {
  const results = db.exec(
    `SELECT id, name, email, password, role, createdAt FROM users WHERE lower(email) = lower(?)`
  , [email]);
  
  if (results.length > 0 && results[0].values.length > 0) {
    const row = results[0].values[0];
    return {
      id: row[0],
      name: row[1],
      email: row[2],
      password: row[3],
      role: row[4] || 'user',
      createdAt: row[5]
    };
  }
  return null;
}

export function findUserById(id) {
  const results = db.exec(
    `SELECT id, name, email, password, role, createdAt FROM users WHERE id = ?`
  , [id]);
  
  if (results.length > 0 && results[0].values.length > 0) {
    const row = results[0].values[0];
    return {
      id: row[0],
      name: row[1],
      email: row[2],
      password: row[3],
      role: row[4] || 'user',
      createdAt: row[5]
    };
  }
  return null;
}

export function addUser(user) {
  db.run(
    `INSERT INTO users (id, name, email, password, role, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user.id, user.name, user.email, user.password, user.role || 'user', user.createdAt]
  );
  saveDB();
  return user;
}

export function updateUser(id, updates) {
  const user = findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedName = updates.name ?? user.name;
  const updatedPassword = updates.password ?? user.password;
  const updatedRole = updates.role ?? user.role;

  db.run(
    `UPDATE users SET name = ?, password = ?, role = ? WHERE id = ?`,
    [updatedName, updatedPassword, updatedRole, id]
  );
  saveDB();

  return {
    ...user,
    name: updatedName,
    password: updatedPassword,
    role: updatedRole
  };
}

// Admin functions
export function getAllUsers() {
  const results = db.exec(
    `SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC`
  );
  
  if (results.length > 0 && results[0].values) {
    return results[0].values.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      role: row[3] || 'user',
      createdAt: row[4]
    }));
  }
  return [];
}

export function deleteUser(id) {
  db.run(`DELETE FROM users WHERE id = ?`, [id]);
  saveDB();
}

export function setUserRole(id, role) {
  const user = findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  
  if (!['user', 'admin'].includes(role)) {
    throw new Error("Invalid role");
  }
  
  return updateUser(id, { role });
}
