const PriceSnapshot = require("../models/PriceSnapshot");
const Product = require("../models/Product");
const { parseFindCommand } = require("../utils/findParser"); // adjust path

const findProductsController = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");
        const { text, language } = body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Query text is required" });
        }

        // Parse text for intent, product, and filters
        const parsed = await parseFindCommand(text, language);
        console.log(parsed)

        if (parsed.intent !== "find") {
            return res.status(400).json({ success: false, message: "No find intent detected" });
        }

        // Build product filter (name, brand, category)
        const filter = {};
        if (parsed.product) {
            filter.name = { $regex: parsed.product.name, $options: "i" };
        }
        if (parsed.filters) {
            const { brand, category } = parsed.filters;
            if (brand) filter.brand = { $regex: brand, $options: "i" };
            if (category) filter.category = { $regex: category, $options: "i" };
        }

        // Fetch products matching name/brand/category
        const products = await Product.find(filter).lean();

        // Apply price filters on PriceSnapshot
        console.log(products)
        const filteredProducts = [];
        for (const prod of products) {
            const latestPrice = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 }).lean();
            if (!latestPrice) continue;

            let include = true;

            if (parsed.filters) {
                const { priceLt, priceGt } = parsed.filters;
                if (priceLt && latestPrice.price > priceLt) include = false;
                if (priceGt && latestPrice.price < priceGt) include = false;
            }

            if (include) {
                filteredProducts.push({
                    ...prod,
                    price: latestPrice.price,
                    priceUpdatedAt: latestPrice.createdAt
                });
            }
        }

        return res.json({
            success: true,
            query: text,
            count: filteredProducts.length,
            data: filteredProducts
        });

    } catch (error) {
        console.error("Find products error:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = { findProductsController };
