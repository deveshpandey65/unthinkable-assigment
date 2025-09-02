const Category = require("../models/Category");
const PriceSnapshot = require("../models/PriceSnapshot");
const Product = require("../models/Product");
// ✅ Create a new product
const createProduct = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");
        const { name, tags, brand, quantity, unit, imageUrl, seasonMonths, category } = body;
        // 1. Create the product
        const product = new Product({
            name,
            tags: Array.isArray(tags) ? tags : tags?.split(',').map(t => t.trim()).filter(Boolean),
            brand,
            quantity: parseFloat(quantity) || 0,
            unit,
            image: imageUrl,
            seasonMonths: Array.isArray(seasonMonths) ? seasonMonths : seasonMonths?.split(',').map(m => parseInt(m.trim())).filter(Boolean),
            category
        });

        await product.save();

        // 2. Handle category
        if (category) {
            const existingCategory = await Category.findOne({ name: category.trim() });

            if (existingCategory) {
                if (!existingCategory.products.includes(product._id)) {
                    existingCategory.products.push(product._id);
                    await existingCategory.save();
                }
            } else {
                const newCategory = new Category({
                    name: category.trim(),
                    products: [product._id],
                });
                await newCategory.save();
            }
        }

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        console.error("Create product error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ Get all products with optional filters (category, brand, tags)
const getProducts = async (req, res) => {
    try {
        const { name, category, brand, tags, search, page = 1, limit = 10 } = req.query;
        let filter = {};

        // If name is provided, fetch by exact name only
        if (name) {
            filter.name = name;
        } else {
            if (category) filter.category = category;
            if (brand) filter.brand = brand;
            if (tags) filter.tags = { $in: tags.toString().split(",") };
            if (search) filter.$text = { $search: search.toString() };
        }

        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        // Get total count
        const total = await Product.countDocuments(filter);

        // Fetch products
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limitNumber);

        // Attach latest price
        const productsWithPrice = (await Promise.all(
            products.map(async (prod) => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                if (!priceDoc) return null;  // exclude if no price
                return {
                    ...prod.toObject(),
                    price: priceDoc.price,
                };
            })
        )).filter(Boolean); // remove nulls


        res.json({
            success: true,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalProducts: total,
            data: productsWithPrice,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        console.log(product)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Get latest price for this product
        const priceDoc = await PriceSnapshot.findOne({ productId: product._id })
            .sort({ createdAt: -1 });

        const productWithPrice = {
            ...product.toObject(),
            price: priceDoc ? priceDoc.price : 0.00,
        };

        res.json({ success: true, data: productWithPrice });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ Update a product
 const updateProduct = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");

        const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Delete a product
 const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//addOrUpdatePriceSnapshot
const addOrUpdatePriceSnapshot = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");

        const { productId, price,source } = body;
        if (!productId || price == null) {
            return res.status(400).json({ success: false, message: "productId and price are required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const snapshot = await PriceSnapshot.find({ productId, source }).sort({ capturedAt: -1 }).limit(1);
        if (snapshot.length > 0) {
            snapshot[0].price = price;
            snapshot[0].capturedAt = new Date();
            await snapshot[0].save();
        } else {
            const newSnapshot = new PriceSnapshot({ productId, price, source });
            await newSnapshot.save();
        }
        res.status(201).json({ success: true, data: snapshot });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

};


const getProductsForPriceSet = async (req, res) => {
    try {
        const { name, category, brand, tags, search, page = 1, limit = 10 } = req.query;
        let filter = {};

        // If name is provided, fetch by exact name only
        if (name) {
            filter.name = name;
        } else {
            if (category) filter.category = category;
            if (brand) filter.brand = brand;
            if (tags) filter.tags = { $in: tags.toString().split(",") };
            if (search) filter.$text = { $search: search.toString() };
        }

        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        // Get total count
        const total = await Product.countDocuments(filter);

        // Fetch products
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limitNumber);

        // Attach latest price
        const productsWithPrice = await Promise.all(
            products.map(async (prod) => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                return {
                    ...prod.toObject(),
                    price: priceDoc ? priceDoc.price : null,
                };
            })
        );

        res.json({
            success: true,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalProducts: total,
            data: productsWithPrice,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addOrUpdatePriceSnapshot,
    getProductsForPriceSet
};
