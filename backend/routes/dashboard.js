const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   GET /dashboard
 * @desc    Protected dashboard route
 * @access  Private (JWT required)
 */
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: `Welcome to the dashboard!`,
    userId: req.user?.id,
    user: req.user, // Include full user info for client use or debugging
  });
});

module.exports = router;
