const mongoose = require("mongoose");

module.exports = mongoose.model("Admin", new mongoose.Schema({
  username: String,
  password: String
}));
