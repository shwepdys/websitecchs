require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: "https://websitecchs.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));

app.get("/", (req, res) => {
  res.send("Backend is running");
});
