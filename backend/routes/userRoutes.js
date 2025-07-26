const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   GET /dashboard
 * @desc    Protected route, returns user data if token is valid
 * @access  Private (Requires JWT Access Token)
 */
router.get('/dashboard', authMiddleware, (req, res) => {
  // Fallback for unexpected missing user
  const userId = req.user?._id || req.user?.id || 'Unknown';

  res.json({
    msg: `✅ Welcome, user with ID: ${userId}`,
    user: req.user || null, // Sends back decoded user info
  });
});

module.exports = router;
