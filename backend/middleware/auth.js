const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};
