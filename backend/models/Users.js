// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // will be email
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // all new users default to 'user'
}, { timestamps: true });

// Optional: hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
