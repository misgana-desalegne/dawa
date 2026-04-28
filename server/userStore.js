import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, "users.json");

async function readUsersFile() {
  try {
    const raw = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

async function writeUsersFile(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email) {
  const users = await readUsersFile();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  const users = await readUsersFile();
  return users.find((user) => user.id === id);
}

export async function addUser(user) {
  const users = await readUsersFile();
  users.push(user);
  await writeUsersFile(users);
  return user;
}

export async function updateUser(id, updates) {
  const users = await readUsersFile();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }

  users[index] = { ...users[index], ...updates };
  await writeUsersFile(users);
  return users[index];
}
