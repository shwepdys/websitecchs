const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Allow preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};
