// src/pages/CategoryDetail.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/utils/api"; // axios wrapper
import ProductCard from "@/components/ProductCard";
import cartApi from "@/utils/cart"; // 🔹 make sure you have this API file
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CategoryDetail() {
    const { id } = useParams();

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const totalItems = useRef(0);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmedItemName, setConfirmedItemName] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get(`/category/${id}/products`);
                setCategoryData(res.data);
            } catch (err) {
                console.error("Error fetching category products:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProducts();
    }, [id]);

    const addToCart = async (product, quantity = 1) => {
        try {
            totalItems.current += quantity;
            setConfirmedItemName(product.name);
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);
            await cartApi.addItem({ productId: product._id, quantity });
        } catch (err) {
            console.error("Failed to add item to cart:", err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header totalItems={totalItems.current} />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-10 pt-28">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center md:text-left">
                    {categoryData?.category.toUpperCase() || "Category Not Found"}
                </h1>

                {categoryData?.products?.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">No products available in this category.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                        {categoryData.products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                addToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showConfirmation && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform animate-slide-in-up">
                    <p className="font-semibold">
                        ✅ Added &quot;{confirmedItemName}&quot; to cart!
                    </p>
                </div>
            )}

            <Footer />
        </div>
    );
}
