
const PriceSnapshot = require("../models/PriceSnapshot");
const Product = require("../models/Product");
const ShoppingList = require("../models/ShoppingList");
const User = require("../models/User");


// ➕ Add item to cart
 const addItemToCart = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");

        const { productId, quantity } = body;
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // Check product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product Not Found" });

        // Get latest price (optional, could enrich list item)
        const priceSnapshot = await PriceSnapshot.findOne({ productId }).sort({ capturedAt: -1 });
        console.log("Price Snapshot:", priceSnapshot);
        // Update user preferences.likes
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User Not Found" });
       
        if (!user.preferences.likes.includes(productId.toString())) {
            user.preferences.likes.push(productId.toString());
            await user.save();
        }

        // Find or create shopping list
        let list = await ShoppingList.findOne({ userId, active: true });
        console.log("Current List:", list);

        if (list) {
            const existingItem = list.items.find(i => i.productId.equals(productId));
            console.log(existingItem,productId)
            if (existingItem) {
                existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
                existingItem.price = priceSnapshot ? priceSnapshot.price : product.price
            } else {
                list.items.push({
                    productId,
                    name: product.name,
                    category: product.category,
                    price: priceSnapshot ? priceSnapshot.price : product.price,
                    quantity,
                    image:product.image,
                });
            }
            await list.save();
        } else {
            list = await ShoppingList.create({
                userId,
                items: [{
                    productId,
                    name: product.name,
                    category: product.category,
                    price: priceSnapshot ? priceSnapshot.price : product.price,
                    quantity,
                }],
            });
        }

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 🛒 Get all cart items
 const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const list = await ShoppingList.findOne({ userId, active: true }).populate("items.productId");
        if (!list) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 🔎 Get single cart item
 const getCartItemById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // item _id

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.status(404).json({ message: "Cart not found" });

        const item = list.items.id(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✏️ Update cart item
 const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // item _id
        const body = JSON.parse(req.body || "{}");

        const { quantity, notes } = body;

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.status(404).json({ message: "Cart not found" });

        const item = list.items.id(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (quantity !== undefined) item.quantity = quantity;
        if (notes !== undefined) item.notes = notes;

        await list.save();

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ❌ Delete cart item
const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // this should be the item _id

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.status(404).json({ message: "Cart not found" });


        // ✅ Use pull instead of item.remove()
        const item = list.items.id(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        list.items.pull({ _id: id }); // removes the item by id
        await list.save();


        res.status(200).json({ message: "Item removed", list });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const addItemToCartFromVoice = async (req, res) => {
    try {

        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // Check product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product Not Found" });

        // Get latest price (optional)
        const priceSnapshot = await PriceSnapshot.findOne({ productId }).sort({ capturedAt: -1 });

        // Update user preferences.likes
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User Not Found" });

        if (!user.preferences.likes.includes(productId.toString())) {
            user.preferences.likes.push(productId.toString());
            await user.save();
        }

        // Find or create shopping list
        let list = await ShoppingList.findOne({ userId, active: true });

        if (list) {
            const existingItem = list.items.find(i => i.productId.equals(productId));
            console.log(existingItem, productId)
            if (existingItem) {
                existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
                existingItem.price = priceSnapshot ? priceSnapshot.price : product.price
            } else {
                list.items.push({
                    productId,
                    name: product.name,
                    category: product.category,
                    price: priceSnapshot ? priceSnapshot.price : product.price,
                    quantity,
                    image:product.image
                });
            }
            await list.save();
        } else {
            list = await ShoppingList.create({
                userId,
                items: [{
                    productId,
                    name: product.name,
                    category: product.category,
                    price: priceSnapshot ? priceSnapshot.price : product.price,
                    quantity,
                }],
            });
        }

        // Voice-friendly message
        const message = `Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to your shopping list.`;

        res.status(201).json({ message, cart: list });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};




const getCartItemsVoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const list = await ShoppingList.findOne({ userId, active: true }).populate("items.productId");
        if (!list || list.items.length === 0) {
            return res.json({ message: "Your shopping list is empty." });
        }

        const itemsText = list.items.map(i => `${i.quantity} ${i.name}`).join(", ");
        return res.json({
            message: `You have the following items in your cart: ${itemsText}.`,
            cart: list
        });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't fetch your cart.", error: error.message });
    }
};

// 🔎 Get single cart item by item ID (voice-friendly)
const getCartItemByIdVoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.json({ message: "Your shopping list is empty." });

        const item = list.items.id(id);
        if (!item) return res.json({ message: "Item not found in your cart." });

        return res.json({ message: `You have ${item.quantity} ${item.name} in your cart.`, item });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't fetch that item.", error: error.message });
    }
};

// ✏️ Update cart item (voice-friendly)
const updateCartItemVoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity, notes } = req.body;

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.json({ message: "Your shopping list is empty." });

        const item = list.items.id(id);
        if (!item) return res.json({ message: "Item not found in your cart." });

        if (quantity !== undefined) item.quantity = quantity;
        if (notes !== undefined) item.notes = notes;

        await list.save();

        const updatedText = `${item.quantity} ${item.name}${item.quantity > 1 ? 's' : ''}`;
        return res.json({ message: `Updated your cart: ${updatedText}.`, cart: list });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't update the item.", error: error.message });
    }
};

// ❌ Delete cart item (voice-friendly)
const deleteCartItemVoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const list = await ShoppingList.findOne({ userId, active: true });
        if (!list) return res.json({ message: "Your shopping list is empty." });

        const item = list.items.id(id);
        if (!item) return res.json({ message: "Item not found in your cart." });

        const itemName = item.name;
        list.items.pull({ _id: id });
        await list.save();

        return res.json({ message: `Removed ${itemName} from your shopping list.`, cart: list });
    } catch (error) {
        return res.json({ message: "Sorry, I couldn't remove the item.", error: error.message });
    }
};



module.exports = {
    addItemToCart,
    getCartItems,
    getCartItemById,
    updateCartItem,
    deleteCartItem,
    addItemToCartFromVoice,
    getCartItemsVoice,
    deleteCartItemVoice,
    updateCartItemVoice,
    getCartItemByIdVoice
};
