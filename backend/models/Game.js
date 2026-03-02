const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: String,
  html: String,   // can contain HTML OR URL
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Game", gameSchema);