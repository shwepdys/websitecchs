const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const jwt = require("jsonwebtoken");

// --- Create a new game ---
router.post("/", async (req, res) => {
  try {
    const { title, html } = req.body;

    if (!title || !html) {
      return res.status(400).json({ error: "Title and HTML are required" });
    }

    const newGame = new Game({ title, html });
    const savedGame = await newGame.save();

    console.log("New game added:", savedGame.title);
    res.json(savedGame);
  } catch (err) {
    console.error("Error in POST /games:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Get all games ---
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error("Error in GET /games:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Update a game ---
router.put("/:id", async (req, res) => {
  try {
    const { title, html } = req.body;
    if (!title || !html) return res.status(400).json({ error: "Title and HTML required" });

    const updated = await Game.findByIdAndUpdate(req.params.id, { title, html }, { new: true });
    if (!updated) return res.status(404).json({ error: "Game not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error in PUT /games/:id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Delete a game ---
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Game not found" });

    res.json({ message: "Game deleted" });
  } catch (err) {
    console.error("Error in DELETE /games/:id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
