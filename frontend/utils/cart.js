import api from "./api";

const cartApi = {
    // ➕ Add item to cart
    addItem: async ({ productId, quantity }) => {
        console.log(productId,quantity)
        const res = await api.post(
            '/cart/',
            { productId, quantity },
            { withCredentials: true } // send JWT cookies
        );
        return res.data;
    },

    // 🛒 Get all cart items
    getCart: async () => {
        const res = await api.get(`/cart`)
        if (res.status=='404'){
            return 'Empty'
        }
        console.log(res.data)
        return res.data;
    },

    // 🔎 Get single cart item by item _id
    getItemById: async (id) => {
        const res = await api.get(`/cart/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },

    // ✏️ Update cart item
    updateItem: async (id, updates) => {
        const res = await api.put(`/cart/${id}`, updates, {
            withCredentials: true,
        });
        return res.data;
    },

    // ❌ Delete cart item
    deleteItem: async (id) => {
        const res = await api.delete(`/cart/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },
};

export default cartApi;