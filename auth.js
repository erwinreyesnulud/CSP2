const jwt = require("jsonwebtoken");
require("dotenv").config();

//Create a JWT token (no expiration)
const createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(data, process.env.JWT_SECRET_KEY);
};

//Middleware: Verify JWT token
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      auth: "Failed",
      message: "No token provided or malformed token"
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({
        auth: "Failed",
        message: "Invalid token"
      });
    }

    req.user = decodedToken;
    next();
  });
};

//Middleware: Check if user is admin (after verify)
const verifyAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      auth: "Failed",
      message: "Action Forbidden"
    });
  }
  next();
};

//Optional: isLoggedIn middleware (used only with sessions, not JWT)
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//Global error handler (optional, useful for centralized error capture)
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Server Error",
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null
    }
  });
};

//Export all
module.exports = {
  createAccessToken,
  verify,
  verifyAdmin,
  isLoggedIn,
  errorHandler
};