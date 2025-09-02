'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, addToCart }) {
  const router=useRouter()

  if (!product) return null;

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col h-full transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
    >
      {/* Product Image */}
      <div
        onClick={() => router.push(`/products/${product._id}`)}
       className="relative overflow-hidden rounded-xl w-full h-48 mb-4">
        <img
          src={product.image || 'https://placehold.co/400x400/F0F4F8/A0AEC0?text=Product'}
          alt={product.name}
          className="object-cover w-full h-full rounded-xl transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 font-medium mb-4">{product.category}</p>
      </div>

      {/* Price and Add to Cart Button */}
      <div className="flex justify-between items-center mt-auto">
        <p className="text-3xl font-bold text-blue-600 mr-4 ">
          ${product?.price?.toFixed(2) || "0.00"}
        </p>

        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => addToCart(product)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
