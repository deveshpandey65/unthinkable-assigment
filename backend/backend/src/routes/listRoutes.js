// Make list Routes
const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');
// Routes
router.post('/', authMiddleware, listController.addItemToCart);
router.get('/', authMiddleware, listController.getCartItems);
router.get('/:id', authMiddleware, listController.getCartItemById);
router.put('/:id', authMiddleware, listController.updateCartItem);
router.delete('/:id', authMiddleware, listController.deleteCartItem);

module.exports = router;