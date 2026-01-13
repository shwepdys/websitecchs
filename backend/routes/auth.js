const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) return res.status(401).json({ error: "User not found" });

  const ok = await bcrypt.compare(req.body.password, admin.password);
  if (!ok) return res.status(403).json({ error: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
