
const Product = require("../models/Product");
const User = require("../models/User");
const PurchaseHistory = require("../models/PurchaseHistory");
const PriceSnapshot = require("../models/PriceSnapshot");
const Category = require("../models/Category");

// 🔮 Recommended items (based on likes + preferredBrands + purchase history)
const recommendedItemsSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const likedIds = user.preferences.likes || [];
        const dislikedIds = user.preferences.disliked || [];
        const preferredBrands = user.preferences.preferredBrands || [];

        // 📦 Get purchased products
        const purchasedDocs = await PurchaseHistory.find({ userId }).select("productId");
        const purchasedIds = purchasedDocs.map(p => p.productId.toString());

        // 🛑 If user has no preference history
        if (likedIds.length === 0 && preferredBrands.length === 0 && purchasedIds.length === 0) {
            const sampleProducts = await Product.find({ _id: { $nin: dislikedIds } }).limit(10);
            const productsWithPrice = await Promise.all(
                sampleProducts.map(async (prod) => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                    return {
                    ...prod.toObject(),
                    price: priceDoc ? priceDoc.price : 0.00,
                    };
                })
            );
            return res.status(200).json({ message: "No recommendations", items: productsWithPrice });
        }

        // 🏷️ Get categories from liked + purchased products
        const baseIds = [...new Set([...likedIds, ...purchasedIds])];
        const baseProducts = await Product.find({ _id: { $in: baseIds } });
        const categories = [...new Set(baseProducts.map(p => p.category))];

        // 🧠 Build recommendation query
        let query = {
            _id: { $nin: dislikedIds }, // exclude disliked
            $or: []
        };

        if (categories.length > 0) {
            query.$or.push({ category: { $in: categories } });
        }

        if (preferredBrands.length > 0) {
            query.$or.push({ brand: { $in: preferredBrands } });
        }

        // If no conditions, fallback to random products
        if (query.$or.length === 0) {
            query = { _id: { $nin: dislikedIds } };
        }

        let recommendations = await Product.find(query).limit(10);
        const productsWithPrice = await Promise.all(
            recommendations.map(async (prod) => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                return {
                    ...prod.toObject(),
                    price: priceDoc ? priceDoc.price : 0.00,
                };
            })
        );

        

        res.status(200).json({ items: productsWithPrice });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 🌸 Seasonal suggestions (based on current month + purchased items)
 const getSeasonalSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentMonth = new Date().getMonth() + 1;

        // 📦 Exclude already purchased seasonal items
        const seasonalProducts = await Product.find({
            seasonMonths: currentMonth,
        }).limit(10);


        const productsWithPrice = await Promise.all(
            seasonalProducts.map(async (prod) => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                return {
                    ...prod.toObject(),
                    price: priceDoc ? priceDoc.price : 0.00,
                };
            })
        );

        res.status(200).json({ items: productsWithPrice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 🛍️ Similar items (by category or substitutions + purchase context)
 const getSimilarItemsSuggestions = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product Not Found" });
        console.log(product.category)
        // Fetch the category and populate its products
        const categoryWithProducts = await Category.findOne({ name: product.category })
            .populate({
                path: "products",
                options: { limit: 10 } // limit the number of products returned
            });

        const similarItems = categoryWithProducts ? categoryWithProducts.products : [];

        res.status(200).json({ items: similarItems });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const recommendedItemsSuggestionsVoice = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.json({ message: "I couldn't find your profile." });

        const likedIds = user.preferences.likes || [];
        const dislikedIds = user.preferences.disliked || [];
        const preferredBrands = user.preferences.preferredBrands || [];

        const purchasedDocs = await PurchaseHistory.find({ userId }).select("productId");
        const purchasedIds = purchasedDocs.map(p => p.productId.toString());

        if (likedIds.length === 0 && preferredBrands.length === 0 && purchasedIds.length === 0) {
            const sampleProducts = await Product.find({ _id: { $nin: dislikedIds } }).limit(10);
            const productsWithPrice = await Promise.all(
                sampleProducts.map(async prod => {
                    const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                    return {
                        ...prod.toObject(),
                        price: priceDoc ? priceDoc.price : 0.00
                    };
                })
            );

            const names = productsWithPrice.map(p => p.name).join(", ");
            return res.json({ message: `Here are some products you might like: ${names}.`, items: productsWithPrice });
        }

        const baseIds = [...new Set([...likedIds, ...purchasedIds])];
        const baseProducts = await Product.find({ _id: { $in: baseIds } });
        const categories = [...new Set(baseProducts.map(p => p.category))];

        let query = { _id: { $nin: dislikedIds }, $or: [] };
        if (categories.length > 0) query.$or.push({ category: { $in: categories } });
        if (preferredBrands.length > 0) query.$or.push({ brand: { $in: preferredBrands } });
        if (query.$or.length === 0) query = { _id: { $nin: dislikedIds } };

        const recommendations = await Product.find(query).limit(10);
        const productsWithPrice = await Promise.all(
            recommendations.map(async prod => {
                const priceDoc = await PriceSnapshot.findOne({ productId: prod._id }).sort({ createdAt: -1 });
                return {
                    ...prod.toObject(),
                    price: priceDoc ? priceDoc.price : 0.00
                };
            })
        );

        const names = productsWithPrice.map(p => p.name).join(", ");
        return res.json({ message: `Based on your preferences, you might like: ${names}.`, items: productsWithPrice });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't fetch recommendations.", error: error.message });
    }
};

// 🌸 Seasonal suggestions (voice-friendly)
const getSeasonalSuggestionsVoice = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentMonth = new Date().getMonth() + 1;

        const purchasedDocs = await PurchaseHistory.find({ userId }).select("productId");
        const purchasedIds = purchasedDocs.map(p => p.productId.toString());

        const seasonalProducts = await Product.find({ seasonMonths: currentMonth }).limit(10);

        if (!seasonalProducts || seasonalProducts.length === 0) {
            return res.json({ message: "There are no seasonal products right now." });
        }

        const names = seasonalProducts.map(p => p.name).join(", ");
        return res.json({ message: `Seasonal items for this month: ${names}.`, items: seasonalProducts });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't fetch seasonal suggestions.", error: error.message });
    }
};

// 🛍️ Similar items (voice-friendly)
const getSimilarItemsSuggestionsVoice = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) return res.json({ message: "I couldn't find that product." });

        const purchasedDocs = await PurchaseHistory.find({ userId }).select("productId");
        const purchasedIds = purchasedDocs.map(p => p.productId.toString());

        const similarItems = await Product.find({
            $or: [
                { category: product.category },
                { _id: { $in: product.substitutions || [] } }
            ],
            _id: { $nin: [...purchasedIds, product._id] }
        }).limit(10);

        if (!similarItems || similarItems.length === 0) {
            return res.json({ message: `There are no similar items to ${product.name}.` });
        }

        const names = similarItems.map(p => p.name).join(", ");
        return res.json({ message: `Items similar to ${product.name}: ${names}.`, items: similarItems });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't fetch similar items.", error: error.message });
    }
};
module.exports = {
    recommendedItemsSuggestions,
    getSeasonalSuggestions,
    getSimilarItemsSuggestions,
    recommendedItemsSuggestionsVoice,
    getSeasonalSuggestionsVoice,
    getSimilarItemsSuggestionsVoice
};