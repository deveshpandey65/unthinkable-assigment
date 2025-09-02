// Make list Routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
// Routes
const CategoryController = require("../controllers/categoryController");

router.get("/", authMiddleware, CategoryController.getAllCategories);
router.get("/:categoryId/products", authMiddleware, CategoryController.getProductsByCategory);
router.get("/products/limit/4", authMiddleware, CategoryController.getFourProductsEachCategory);


module.exports = router;