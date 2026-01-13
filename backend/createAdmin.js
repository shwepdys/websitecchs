const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // path to Admin.js

// MongoDB connection string — replace with yours
const MONGO_URI = "mongodb+srv://aldlimbetov_db_user:sAiiA3xEjcJ3rxro@websitecchs.gks4rjc.mongodb.net/websiteCCHS?retryWrites=true&w=majority";

// Admin credentials
const username = "admin";
const password = "10191805iP";

async function createAdmin() {
  try {
    // Connect to MongoDB (no extra options needed)
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Save admin user
    const admin = new Admin({ username, password: hash });
    await admin.save();

    console.log("Admin user created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
