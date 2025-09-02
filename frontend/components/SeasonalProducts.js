"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import api from "@/utils/api"; // Your Axios or fetch wrapper

export default function SeasonalProducts({ searchTerm, addToCart }) {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStart, setScrollStart] = useState(0);
    const [paused, setPaused] = useState(false);
    const [products, setProducts] = useState([]);

    // Fetch seasonal products from API
    const fetchProducts = async () => {
        try {
            const res = await api.get("/suggest/seasonal"); // Adjust endpoint
            console.log(res.data)
            setProducts(res.data.items || []);
        } catch (err) {
            console.error("Failed to fetch seasonal products:", err);
            setProducts([]);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filteredProducts = searchTerm
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p?.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : products;

    const maxScrollLeft = () => {
        const el = sliderRef.current;
        if (!el) return 0;
        return Math.max(0, el.scrollWidth - el.clientWidth);
    };

    const pageWidth = () => sliderRef.current?.clientWidth || 0;

    const jumpToStart = () => sliderRef.current?.scrollTo({ left: 0, behavior: "auto" });
    const jumpToEnd = () => sliderRef.current?.scrollTo({ left: maxScrollLeft(), behavior: "auto" });

    const slideRightOnePage = () => {
        const el = sliderRef.current;
        if (!el) return;
        const next = el.scrollLeft + pageWidth();
        const end = maxScrollLeft();
        if (next >= end - 1) {
            jumpToStart();
            requestAnimationFrame(() => {
                el.scrollTo({ left: Math.min(pageWidth(), end), behavior: "smooth" });
            });
        } else {
            el.scrollTo({ left: next, behavior: "smooth" });
        }
    };

    const slideLeftOnePage = () => {
        const el = sliderRef.current;
        if (!el) return;
        const prev = el.scrollLeft - pageWidth();
        if (el.scrollLeft <= 1) {
            const end = maxScrollLeft();
            jumpToEnd();
            requestAnimationFrame(() => {
                el.scrollTo({ left: Math.max(end - pageWidth(), 0), behavior: "smooth" });
            });
        } else {
            el.scrollTo({ left: Math.max(prev, 0), behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (paused || filteredProducts.length === 0) return;
        const id = setInterval(slideRightOnePage, 2000);
        return () => clearInterval(id);
    }, [paused, filteredProducts.length]);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollStart(sliderRef.current.scrollLeft);
        setPaused(true);
    };
    const onMouseUp = () => {
        setIsDragging(false);
        setPaused(false);
    };
    const onMouseLeave = () => {
        setIsDragging(false);
        setPaused(false);
    };
    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollStart - walk;
    };

    const showArrows = (sliderRef.current?.scrollWidth || 0) > (sliderRef.current?.clientWidth || 0);

    return (
        <section className="relative">
            <h2 className="text-4xl font-extrabold mb-8 text-gray-800">Seasonal Favorites</h2>

            {filteredProducts.length > 0 ? (
                <>
                    {showArrows && (
                        <>
                            <button
                                onClick={slideLeftOnePage}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/70 p-3 rounded-full z-10 hover:bg-gray-700"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="text-white w-6 h-6" />
                            </button>
                            <button
                                onClick={slideRightOnePage}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/70 p-3 rounded-full z-10 hover:bg-gray-700"
                                aria-label="Next"
                            >
                                <ChevronRight className="text-white w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div
                        ref={sliderRef}
                        className="flex overflow-x-scroll gap-8 pb-4 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                    >
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-400">No seasonal products available.</p>
            )}
        </section>
    );
}
