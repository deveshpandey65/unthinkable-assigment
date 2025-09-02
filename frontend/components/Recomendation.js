'use client'
import React, { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Recomendation({ searchTerm, recommendedProducts, addToCart }) {
    const scrollRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // 🔍 filter products safely
    let filtered = recommendedProducts || [];
    if (searchTerm) {
        filtered = filtered.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Duplicate products for infinite effect
    const products = [...filtered, ...filtered];

    // Auto slide every 2 seconds
    useEffect(() => {
        if (!autoScroll || products.length === 0) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth",
                });

                // Reset scroll when reaching the end
                if (
                    scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
                    scrollRef.current.scrollWidth - 10
                ) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [autoScroll, products.length]);

    // Handle manual scroll with arrows
    const scroll = (direction) => {
        if (scrollRef.current) {
            setAutoScroll(false);
            scrollRef.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    // 🛑 render nothing if no products
    if (filtered.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-4xl font-extrabold mb-8 text-gray-500">Recommended for You</h2>

            <div className="relative">
                {/* Left Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-4 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth"
                >
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} addToCart={addToCart} />
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}
