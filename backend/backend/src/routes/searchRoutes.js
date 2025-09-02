// make Search Routes
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');    
// Routes
router.post('/', authMiddleware, searchController.findProductsController);
module.exports = router;