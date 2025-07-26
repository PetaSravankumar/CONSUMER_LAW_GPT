const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const TokenModel = require('../models/tokenModel');
const { verifyRefreshToken, generateAccessToken } = require('../utils/jwt');
const {
  signupUser,
  loginUser,
  logoutUser,
  refreshToken,
} = require('../controllers/authController');

const router = express.Router();
router.use(cookieParser());

// Auth Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

// ✅ Updated refresh-token route with DB check
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Step 1: Check if token exists in DB
    const storedToken = await TokenModel.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({ message: 'Refresh token not recognized' });
    }

    // Step 2: Verify the refresh token's signature
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Step 3: Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', logoutUser);

module.exports = router;
