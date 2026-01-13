const mongoose = require("mongoose");

module.exports = mongoose.model("Game", new mongoose.Schema({
  title: String,
  html: String,
  createdAt: { type: Date, default: Date.now }
}));
