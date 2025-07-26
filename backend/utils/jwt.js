const jwt = require('jsonwebtoken');

// Ensure the process.env types are correctly recognized for JWT secrets

/**
 * Generate a short-lived access token (15 minutes)
 * @param {string} userId - ID of the user
 * @returns {string} JWT access token
 */
function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m', // 15 minutes
  });
}

/**
 * Generate a long-lived refresh token (7 days)
 * @param {string} userId - ID of the user
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d', // 7 days
  });
}

/**
 * Verify the refresh token and return the decoded data
 * @param {string} refreshToken - The refresh token to verify
 * @returns {object} Decoded JWT data if valid, or null if invalid
 */
function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return decoded; // Return decoded payload
  } catch (err) {
    console.error('Invalid refresh token:', err);
    return null; // Return null if token is invalid or expired
  }
}

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };
