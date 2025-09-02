
const Order = require("../models/Order");
const ShoppingList = require("../models/ShoppingList");
const PurchaseHistory = require("../models/PurchaseHistory");
const Product = require("../models/Product");
const PriceSnapshot = require("../models/PriceSnapshot");

// Place order from Cart
 const placeOrderFromCart = async (req, res) => {
    try {
        const userId  = req.user._id;
        const list = await ShoppingList.findOne({ userId, active: true }).populate("items.productId");        
        const cart = await ShoppingList.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }
        const items = cart.items.map((item) => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            notes: item.notes || ""
        }));

        const totalAmount = items.reduce((acc, i) => acc + i.quantity * i.price, 0);
        const order = new Order({
            userId,
            items,
            totalAmount,
            currency: "USD",
            status: "pending"
        });
        await order.save();

        // Save to purchase history
        for (const i of items) {
            await PurchaseHistory.create({
                userId,
                productId: i.productId,
                qty: i.quantity,
                purchasedAt: new Date()
            });
        }

        cart.items = [];
        await cart.save();

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// Get all orders of a user
 const getUserOrders = async (req, res) => {
    try {
        const  userId  = req.user._id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// Get all orders (admin)
 const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate("userId", "name email").populate("items.productId", "name price");
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// Update order status (admin or system)
 const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const body = JSON.parse(req.body || "{}");

        const { status } = body;

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


const orderFromCartVoice = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch the active cart and populate product details
        const cart = await ShoppingList.findOne({ userId, active: true }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Prepare items for the order
        const items = cart.items.map((item) => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            unit: item.unit || item.productId.unit || "",
            price: item.price,
            notes: item.notes || ""
        }));

        // Calculate total amount
        const totalAmount = items.reduce((acc, i) => acc + i.quantity * i.price, 0);

        // Create the order
        const order = new Order({
            userId,
            items,
            totalAmount,
            currency: "USD",
            status: "pending",
        });
        await order.save();

        // Save purchase history
        const purchaseHistoryEntries = items.map((i) => ({
            userId,
            productId: i.productId,
            qty: i.quantity,
            purchasedAt: new Date()
        }));
        await PurchaseHistory.insertMany(purchaseHistoryEntries);

        // Clear the cart
        cart.items = [];
        await cart.save();

        // Generate voice message
        const productList = items.map(i => `${i.quantity} ${i.name}`).join(", ");
        const voiceMessage = `Your order for ${productList} has been placed successfully. The total amount is ${totalAmount} dollars.`;

        res.json({ success: true, order, message:voiceMessage });

    } catch (err) {
        console.error("Error ordering from cart:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const createDirectOrderVoice = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, quantity = 1, unit = "", notes = "" } = req.body;

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const productPrice = await PriceSnapshot.findOne({ productId: productId });

        // Prepare order item
        const orderItem = {
            productId: product._id,
            name: product.name,
            quantity,
            unit: unit || product.unit || "",
            price: productPrice.price,
            notes,
        };

        // Calculate total amount
        const totalAmount = orderItem.quantity * orderItem.price;

        // Create order
        const order = new Order({
            userId,
            items: [orderItem],
            totalAmount,
            currency: "USD",
            status: "pending",
        });
        await order.save();

        // Save purchase history
        await PurchaseHistory.create({
            userId,
            productId: product._id,
            qty: quantity,
            purchasedAt: new Date(),
        });

        // Voice message text
        const voiceMessage = `Your order for ${quantity} ${product.name}${quantity > 1 ? 's' : ''} has been placed successfully. The total amount is ${totalAmount} dollars.`;

        res.json({ success: true, order, message:voiceMessage });
    } catch (err) {
        console.error("Error creating direct order:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};



module.exports = {
    placeOrderFromCart,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    orderFromCartVoice,
    createDirectOrderVoice
};
