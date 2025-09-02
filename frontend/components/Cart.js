"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // ✅ use Next.js Image
import cartApi from "@/utils/cart";
import orderApi from "@/utils/order";

export default function Cart({ cartItems, setCartItems, totalItems }) {
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Load cart on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await cartApi.getCart();
                setCartItems(res.items || []);
                if (totalItems?.current !== undefined) {
                    totalItems.current = res.items.length || 0;
                }
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [setCartItems, totalItems]);

    // Handle quantity change
    const handleQuantityChange = async (id, delta) => {
        const itemToUpdate = cartItems.find(i => i._id === id);
        if (!itemToUpdate) return;

        const newQuantity = Math.max(1, itemToUpdate.quantity + delta);

        setCartItems(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        try {
            await cartApi.updateItem(id, { quantity: newQuantity });
        } catch (err) {
            console.error("Failed to update item:", err);
        }
    };

    // Remove item
    const handleRemoveItem = async (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
        if (totalItems?.current !== undefined) totalItems.current -= 1;

        try {
            await cartApi.deleteItem(id);
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    // Checkout
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setCheckoutLoading(true);

        try {
            const res = await orderApi.orderFromCart();
            if (res.success) {
                // Use a custom modal instead of alert
                alert("Order placed successfully!");
                setCartItems([]);
                if (totalItems?.current !== undefined) totalItems.current = 0;
            } else {
                alert("Failed to place order: " + res.message);
            }
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("Checkout failed. Try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const cartTotal = cartItems
        .reduce((total, item) => total + (item.price * item.quantity), 0)
        .toFixed(2);
    

    if (loading) {
        return (
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-xl h-fit sticky top-28 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-xl h-fit sticky top-28">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                Your Cart
                <span className="text-gray-500 text-base font-normal">({totalItems?.current || 0} items)</span>
            </h2>
            {cartItems.length > 0 ? (
  <div className="max-h-[200px] overflow-y-auto pr-1 space-y-4">
    <ul className="space-y-4">
      {cartItems.map((item) => (
        <li
          key={item._id}
          className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={item.image || "https://placehold.co/100x100/F0F4F8/A0AEC0?text=Item"}
              alt={item.name}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            <div className="flex items-center mt-2 space-x-2">
              <button
                className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                onClick={() => handleQuantityChange(item._id, -1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
              </button>
              <span className="text-gray-800 font-bold">{item.quantity}</span>
              <button
                className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                onClick={() => handleQuantityChange(item._id, 1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
          </div>
          <button
            className="text-red-500 hover:text-red-600 transition-colors p-1"
            onClick={() => handleRemoveItem(item._id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="text-gray-400 text-center py-12 flex flex-col items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /></svg>
    <p className="mt-4 text-lg font-medium">Add Items! Your cart is empty.</p>
  </div>
)}

            {cartItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <p className="text-gray-800">Total:</p>
                        <p className="text-blue-600">${cartTotal}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checkoutLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {checkoutLoading ? "Processing..." : "Checkout"}
                    </button>
                </div>
            )}
        </aside>
    );
}

