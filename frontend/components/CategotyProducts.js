"use client";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const router =useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/category/products/limit/4");
                console.log('category',res.data)
                const data = await res.data
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p className="ml-3 text-gray-500">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="grid max-w-8xl grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-100 rounded-3xl mx-auto shadow-inner">
            {categories.map((category, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    {/* Category Title with View All link */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-800">{category.category.toUpperCase()}</h2>
                        <a
                            href={`/category/${category._id}`}
                            className="flex items-center text-blue-600 font-semibold hover:underline group"
                        >
                            View All
                            <span className="ml-1 text-xl transition-transform duration-300 group-hover:translate-x-1">›</span>
                        </a>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {category.products.map((product, pIdx) => (
                            <div
                                onClick={()=>{router.push(`/products/${product._id}`)}}
                                key={pIdx}
                                className="bg-gray-50 rounded-lg p-3 group hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                            >
                                <img
                                    src={product.image || "https://placehold.co/300x300"}
                                    alt={product.name}
                                    className="h-28 w-full object-cover rounded-lg mb-2 transform transition-transform duration-300 group-hover:scale-110"
                                />
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {product.name.toUpperCase()}
                                </p>
                                <p className="text-xs font-bold text-green-600">
                                    {product.brand || "Top Deal"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
