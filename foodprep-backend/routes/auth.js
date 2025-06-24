const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const USERS_FILE = "./users.json";
const JWT_SECRET = "my_secret_key";

function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const users = getUsers();
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ msg: "User already exists" });

  const hashed = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashed,
    role: role || "user",
  };
  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
  res.json({ token });
});

module.exports = router;
