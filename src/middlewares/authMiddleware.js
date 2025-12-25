const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/serverConfig");
const { findUserById } = require("../repositories/userRepository");

async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
        error: "No auth token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ attach FULL user from DB
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
}

function isAuthorized(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        error: "You are not authorized"
      });
    }
    next();
  };
}

module.exports = {
  isAuthenticated,
  isAuthorized
};
