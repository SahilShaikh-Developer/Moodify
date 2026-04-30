const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access token is missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Redis blacklist check
    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please log in again",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access token is invalid or expired",
    });
  }
}

module.exports = { authUser };
