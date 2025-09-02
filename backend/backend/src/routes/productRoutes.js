const { Router } = require("express");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addOrUpdatePriceSnapshot,
    getProductsForPriceSet
} = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const router = Router();

// CRUD Routes
router.use(auth)
router.post("/", authorize('admin'), createProduct);        // Create product
router.get("/", getProducts);           // Get all products (with filters)
router.get('/search-for-price-set', authorize('admin'), getProductsForPriceSet)
router.get("/:id", getProductById);     // Get product by ID
router.put("/:id", authorize('admin'), updateProduct);      // Update product
router.delete("/:id", authorize('admin'), deleteProduct);   // Delete product
router.post('/add-updatePrice', authorize('admin'), addOrUpdatePriceSnapshot);

module.exports = router;
