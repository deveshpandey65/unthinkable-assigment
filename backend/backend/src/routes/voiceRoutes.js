const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const voiceController = require('../controllers/voiceController');
// For now: simple echo route
router.post("/", authMiddleware, voiceController.handleVoiceCommand );

module.exports = router;
