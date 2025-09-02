"use client";

import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// 🔹 Category Icon Renderer
const Icon = ({ name }) => {
    switch (name.toLowerCase()) {
        case "dairy":
            return <span className="text-blue-500 text-3xl">🥛</span>; // milk icon
        case "fruit":
            return <span className="text-red-500 text-3xl">🍎</span>; // apple
        case "produce":
            return <span className="text-green-500 text-3xl">🥦</span>; // broccoli
        case "snacks":
            return <span className="text-yellow-500 text-3xl">🍪</span>; // cookie
        default:
            return <span className="text-gray-400 text-3xl">📦</span>; // fallback
    }
};

export default function CategoryBar() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const router=useRouter()
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/category");
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-6">
                <p className="text-gray-500">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="bg-white py-4 px-6 rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-7xl">
            <div className="flex justify-between items-center gap-8 overflow-x-auto no-scrollbar scrollbar-hide">
                {categories.map((cat) => (
                    <div
                        onClick={()=>{router.push(`/category/${cat._id}`)}}
                        key={cat._id}
                        className="flex flex-col items-center cursor-pointer min-w-[100px] group transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="relative p-3 rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-gray-200">
                            <div className="h-16 w-16 flex items-center justify-center">
                                <Icon name={cat.name} />
                            </div>
                        </div>
                        <p className="text-sm mt-2 font-medium flex items-center gap-1 text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                            {cat.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
