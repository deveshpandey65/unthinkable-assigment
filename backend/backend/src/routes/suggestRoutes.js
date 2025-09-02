// make suggest Routes
const express = require('express');
const router = express.Router();
const suggestController = require('../controllers/suggestController');
const authMiddleware = require('../middlewares/authMiddleware');
// Routes
router.get('/', authMiddleware, suggestController.recommendedItemsSuggestions);
router.get('/seasonal', authMiddleware, suggestController.getSeasonalSuggestions);
router.get('/similar/:productId', authMiddleware, suggestController.getSimilarItemsSuggestions);

module.exports = router;