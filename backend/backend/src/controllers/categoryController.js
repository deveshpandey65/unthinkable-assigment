// controllers/CategoryController.js
const Category = require("../models/Category");
const Product = require("../models/Product");

// 1. Get all category names
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}, "name");
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories", details: err.message });
    }
};

// 2. Get products of a specific category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId).populate("products");
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ category: category.name, products: category.products });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
};

// 3. Get 4 products from each category
exports.getFourProductsEachCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        const result = await Promise.all(
            categories.map(async (cat) => {
                const products = await Product.find({ category: cat.name }).limit(4);
                return {
                    category: cat.name,
                    products,
                    _id:cat._id
                };
            })
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch 4 products for each category", details: err.message });
    }
};
