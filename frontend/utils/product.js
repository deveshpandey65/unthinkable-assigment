import api from "./api";

// ✅ Get products with pagination and filters
 const getProducts = async (params = {}) => {
    try {
        const response = await api.get("/product", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
const getSimilarProducts = async ( {productId} ) => {
    try {
        console.log(productId)
        const response = await api.get(`/suggest/similar/${ productId }`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// ✅ Get single product by ID
 const getProductById = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

// ✅ Add new product
 const addProduct = async (productData) => {
    try {
        const response = await api.post("/product", productData);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// ✅ Update product
 const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/product/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// ✅ Delete product
 const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

const recommendedProducts=async()=>{
    try {
        const response = await api.get(`/suggest`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

export default { getSimilarProducts,getProducts, getProductById, addProduct, updateProduct, deleteProduct, recommendedProducts };