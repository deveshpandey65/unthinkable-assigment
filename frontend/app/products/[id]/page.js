'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import productApi from '@/utils/product';
import { useParams } from 'next/navigation';
import cartApi from '@/utils/cart';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProducts, setSimilarProducts] = useState([]);

    // Cart state
    const [cartItems, setCartItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmedItemName, setConfirmedItemName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await productApi.getProductById(id);
                setProduct(res.data);

                if (res.data?.category) {
                    const simRes = await productApi.getSimilarProducts({ productId: res.data._id });
                    setSimilarProducts(simRes.items.filter(p => p._id !== id));
                }
            } catch (error) {
                console.error("Error fetching product or similar products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async (product, quantity = 1) => {
        try {
            setCartItems(prev => {
                const existing = prev.find(i => i._id === product._id);
                if (existing) {
                    return prev.map(i =>
                        i._id === product._id
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    );
                } else {
                    return [...prev, { ...product, quantity }];
                }
            });

            setConfirmedItemName(product.name);
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);

            // Persist to backend
            await cartApi.addItem({ productId: product._id, quantity });
            alert('Item Added')
        } catch (err) {
            console.error("Failed to add item to cart:", err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-600">Product not found.</div>;

    return (
        <div className="bg-gray-50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center px-8 shadow-sm">
                <Header />
            </div>

            {/* Product Section */}
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col items-center justify-center p-8">
                <div className="max-w-4xl w-full flex flex-col md:flex-row gap-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
                    {/* Product Image */}
                    <div className="md:w-1/2">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-2xl shadow-md"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="md:w-1/2 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-extrabold text-blue-600">{product.name}</h2>
                            <p className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2) || "0.00"}</p>
                            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{product.category}</p>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="w-full text-gray-700 font-bold py-4 px-6 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                                onClick={() => window.history.back()}
                            >
                                Back to Shopping
                            </button>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <div className="mt-16 w-full max-w-4xl">
                    <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center md:text-left">
                        Similar Products
                    </h2>
                    <div className="flex overflow-x-auto gap-8 pb-4 no-scrollbar scrollbar-hide">
                        {similarProducts.length > 0
                            ? similarProducts.map((p) => (
                                <ProductCard key={p._id} product={p} addToCart={handleAddToCart} />
                            ))
                            : <p className="text-gray-500">No similar products available.</p>}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
