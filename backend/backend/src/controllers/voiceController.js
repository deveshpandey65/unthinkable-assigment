const ShoppingList = require("../models/ShoppingList");
const { parseVoiceCommand } = require("../utils/parser");
const {
    addItemToCartFromVoice,
    deleteCartItemVoice,
    getCartItemsVoice
} = require("./listController");
const { orderFromCartVoice, createDirectOrderVoice } = require("./orderController");
const {
    recommendedItemsSuggestionsVoice,
    getSeasonalSuggestionsVoice,
    getSimilarItemsSuggestionsVoice
} = require("./suggestController");

const handleVoiceCommand = async (req, res) => {
    try {
        const userId = req.user.id;
        const body = JSON.parse(req.body || "{}");

        const { text, language = "en" } = body;

        if (!text) return res.status(400).json({ message: "No voice text provided" });

        const parsed = await parseVoiceCommand(text, language);
        console.log("parsed:", parsed);

        switch (parsed.intent) {
            // 📦 Show current cart
            case "show":
                return getCartItemsVoice(req, res);

            // ➕ Add item
            case "add":
                if (!parsed.product) {
                    return res.json({ message: "Sorry, I couldn't find the item to add." });
                }
                req.body = {
                    productId: parsed.product._id,
                    quantity: parsed.quantity,
                };
                console.log('addto cart called')
                return addItemToCartFromVoice(req, res);

            // ❌ Remove item
            case "remove":
                if (!parsed.product) {
                    return res.json({ message: "Sorry, I couldn't find the item to remove." });
                }
                const list = await ShoppingList.findOne({ userId, active: true });
                if (!list) return res.json({ message: "Your shopping list is empty." });

                const itemToRemove = list.items.find(i => i.productId.equals(parsed.product._id));
                if (!itemToRemove) return res.json({ message: `${parsed.product.name} is not in your cart.` });

                req.params.id = itemToRemove._id;
                return deleteCartItemVoice(req, res);

            // 💡 Suggest recently added items
            case "suggest":
                return recommendedItemsSuggestionsVoice(req, res);

            // 🌸 Seasonal items
            case "seasonal":
                return getSeasonalSuggestionsVoice(req, res);

            // 🛍️ Similar items
            case "similar":
                if (!parsed.product) {
                    return res.json({ message: "Please specify the product to find similar items." });
                }
                req.params.productId = parsed.product._id;
                return getSimilarItemsSuggestionsVoice(req, res);

            // 🛒 Order items
            case "order":
                if (parsed.type === "cart") {
                    // Order everything in the cart
                    return orderFromCartVoice(req, res);
                } else if (parsed.type === "product" && parsed.product) {
                    // Order a single product
                    req.body = {
                            
                                productId: parsed.product._id,
                                quantity: parsed.quantity || 1
                            
                        
                    };
                    return createDirectOrderVoice(req, res);
                } else {
                    return res.json({ message: "Please specify the product to order or say 'order my cart'." });
                }

            default:
                return res.json({ message: "Sorry, I didn't understand the command." });
        }


    } catch (err) {
        console.error("Voice command error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { handleVoiceCommand };
