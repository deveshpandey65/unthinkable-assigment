// utils/order.js
import api from "./api"; // your axios or fetch wrapper

const orderApi = {
    // Place order from cart
    orderFromCart: async () => {
        try {
            const res = await api.post("/order/from-cart");
            return res.data; // should contain { success: true/false, message, ... }
        } catch (err) {
            console.error("Order from cart error:", err);
            return { success: false, message: err.message };
        }
    },

    // Get all orders
    getOrders: async () => {
        try {
            const res = await api.get(`/order/my-order`);
            return res.data;
        } catch (err) {
            console.error("Fetch orders error:", err);
            return { success: false, message: err.message };
        }
    },

    // Get single order
    getOrderById: async (id) => {
        try {
            const res = await api.get(`/order/${id}`);
            return res.data;
        } catch (err) {
            console.error("Fetch order error:", err);
            return { success: false, message: err.message };
        }
    },
};

export default orderApi;
