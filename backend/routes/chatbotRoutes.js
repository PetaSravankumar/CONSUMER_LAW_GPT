const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController'); // Make sure the controller exists

// POST /api/chat
router.post('/', authMiddleware, chatController.chat);

module.exports = router;
