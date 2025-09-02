"use client";

import withAuthAdmin from '@/hoc/withAuthAdmin';
import api from '@/utils/api';
import { useEffect, useState } from 'react';
 function AdminDashboardPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceUpdate, setPriceUpdate] = useState('');

    const [modal, setModal] = useState({ show: false, type: 'info', title: '', message: '' });

    const [productAddForm, setProductAddForm] = useState({
        name: '', category: '', tags: '', brand: '', quantity: '', unit: '', seasonMonths: '', image: null
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantityUpdate, setQuantityUpdate] = useState('');

    const showModal = (type, title, message) => setModal({ show: true, type, title, message });
    const handleCloseModal = () => setModal({ show: false, type: 'info', title: '', message: '' });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/order');
            setOrders(res.data.orders || []);
            console.log(res.data.orders)
        } catch (err) {
            console.error(err);
            showModal("error", "Error", "Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query) return setSearchResults([]);
        try {
            const res = await api.get(`/product/search-for-price-set?name=${encodeURIComponent(query)}`);
            setSearchResults(res.data.data || []);
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        }
    };

    const handleSelectProduct = (prod) => {
        setSelectedProduct(prod);
        setSearchQuery(prod.name);
        setSearchResults([]);
        setQuantityUpdate(prod.quantity || '');
    };

    // --- Cloudinary Image Upload ---
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset"); // Your unsigned preset
        // Cloud name is already in the URL, no need to append her

        try {
            const res = await fetch(``, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            return data.secure_url; // this is the URL of the uploaded image
        } catch (err) {
            console.error("Cloudinary upload failed:", err);
            showModal("error", "Error", "Failed to upload image.");
            return null;
        }
    };


    const handleAddProduct = async (e) => {
        e.preventDefault();
        const { name, category, tags, brand, quantity, unit, seasonMonths, image } = productAddForm;

        let imageUrl = "";
        if (image) {
            imageUrl = await uploadToCloudinary(image);
            if (!imageUrl) return; // stop if image upload failed
        }

        try {
            const res = await api.post('/product', {
                name,
                category,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                brand,
                quantity: parseFloat(quantity) || 0,
                unit,
                seasonMonths: seasonMonths.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m)),
                imageUrl // send Cloudinary URL
            });

            if (res.data.success) {
                showModal("success", "Product Added", `Product "${name}" added successfully.`);
                setProductAddForm({ name: '', category: '', tags: '', brand: '', quantity: '', unit: '', seasonMonths: '', image: null });
            } else showModal("error", "Failed", res.data.message || "Failed to add product.");
        } catch (err) {
            console.error(err);
            showModal("error", "Error", "Failed to add product.");
        }
    };

    const handleQuantityUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return showModal("error", "Error", "Please select a product first.");

        try {
            const res = await api.put(`/product/${selectedProduct._id}`, { quantity: parseFloat(quantityUpdate) });
            if (res.status === 200) showModal("success", "Quantity Updated", `Quantity of "${selectedProduct.name}" updated.`);
            else showModal("error", "Failed", "Failed to update quantity.");
        } catch (err) {
            console.error(err);
            showModal("error", "Error", "Failed to update quantity.");
        }
    };

    const modalBg = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700'
    }[modal.type];

    return (
        <div className="bg-gray-100 flex flex-col items-center p-4 min-h-screen">
            <div className="container max-w-6xl mx-auto my-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
                    {loading && <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-gray-300 mx-auto mt-4"></div>}
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Product */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h2>
                        <form className="space-y-4" onSubmit={handleAddProduct}>
                            {['name', 'category', 'brand', 'tags', 'quantity', 'unit', 'seasonMonths'].map(field => (
                                <input
                                    key={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={productAddForm[field]}
                                    onChange={e => setProductAddForm({ ...productAddForm, [field]: e.target.value })}
                                    className="input-field"
                                    required={field === 'name'}
                                />
                            ))}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setProductAddForm({ ...productAddForm, image: e.target.files[0] })}
                                className="input-field"
                            />
                            <button type="submit" className="btn-primary w-full">Add Product</button>
                        </form>
                    </section>

                    {/* Quantity Update */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-green-600">Update Quantity</h2>
                        <form className="space-y-4" onSubmit={handleQuantityUpdate}>
                            <input placeholder="Search Product" value={searchQuery} onChange={e => handleSearch(e.target.value)} className="input-field w-full" />
                            {searchResults.length > 0 && (
                                <ul className="absolute z-20 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                                    {searchResults.map(prod => (
                                        <li key={prod._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectProduct(prod)}>
                                            {prod.name} ({prod.brand || 'No brand'})
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input placeholder="New Quantity" type="number" step="0.1" value={quantityUpdate} onChange={e => setQuantityUpdate(e.target.value)} className="input-field" />
                            <button type="submit" className="btn-success w-full">Update Quantity</button>
                        </form>
                    </section>


                    {/* Price Update */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-blue-600">Update Price</h2>
                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            if (!selectedProduct) return showModal("error", "Error", "Please select a product first.");

                            try {
                                const res = await api.post('/product/add-updatePrice', {
                                    productId: selectedProduct._id,
                                    price: parseFloat(priceUpdate),
                                    source: 'ADMIN'
                                });
                                if (res.data.success) showModal("success", "Price Updated", `Price of "${selectedProduct.name}" updated.`);
                                else showModal("error", "Failed", "Failed to update price.");
                            } catch (err) {
                                console.error(err);
                                showModal("error", "Error", "Failed to update price.");
                            }
                        }}>
                            <input
                                placeholder="Search Product"
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                                className="input-field w-full"
                            />
                            {searchResults.length > 0 && (
                                <ul className="absolute z-20 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                                    {searchResults.map(prod => (
                                        <li key={prod._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectProduct(prod)}>
                                            {prod.name} ({prod.brand || 'No brand'})
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input
                                placeholder="New Price"
                                type="number"
                                step="0.01"
                                value={priceUpdate}
                                onChange={e => setPriceUpdate(e.target.value)}
                                className="input-field"
                            />
                            <button type="submit" className="btn-primary w-full">Update Price</button>
                        </form>
                    </section>

                    {/* Orders Section */}
                    <section className="col-span-1 lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-200 mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-purple-600">Orders</h2>

                        {loading ? (
                            <div className="text-center py-6">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-purple-500 border-gray-300 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <p className="text-gray-500">No orders available.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="px-4 py-2 border">Order ID</th>
                                            <th className="px-4 py-2 border">Customer</th>
                                            <th className="px-4 py-2 border">Items</th>
                                            <th className="px-4 py-2 border">Total</th>
                                            <th className="px-4 py-2 border">Status</th>
                                            <th className="px-4 py-2 border">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border text-sm">{order._id}</td>
                                                <td className="px-4 py-2 border text-sm">{order.userId?.email || "Guest"}</td>
                                                <td className="px-4 py-2 border text-sm">
                                                    <ul className="list-disc list-inside">
                                                        {order.items.map((item, idx) => (
                                                            <li key={idx}>
                                                                {console.log(item)}
                                                                {item?.name} × {item.quantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="px-4 py-2 border font-semibold">
                                                    ₹{order.totalAmount?.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status === "pending"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>


                </main>

                {/* Modal */}
                {modal.show && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                        <div className={`p-6 rounded-xl border-l-4 ${modalBg} max-w-md w-full shadow-lg`}>
                            <h3 className="text-xl font-bold mb-2">{modal.title}</h3>
                            <p className="mb-4">{modal.message}</p>
                            <button onClick={handleCloseModal} className="btn-secondary w-full">Close</button>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .input-field { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.5rem; }
                    .btn-primary { background: #3b82f6; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; }
                    .btn-success { background: #16a34a; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; }
                    .btn-secondary { background: #6b7280; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; }
                `}</style>
            </div>
        </div>
    );
}
export default withAuthAdmin(AdminDashboardPage);
