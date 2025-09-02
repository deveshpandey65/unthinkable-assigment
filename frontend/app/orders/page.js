"use client";

import React, { useEffect, useState } from "react";
import orderApi from "@/utils/order";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await orderApi.getOrders();
                setOrders(res.orders || []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
                Loading your orders...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <Header />
                <p className="text-2xl font-semibold mt-16">You have no orders yet.</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100">
            <Header />

            <main className="max-w-6xl mx-auto p-8 mt-16">
                <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>

                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li
                            key={order._id}
                            className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <p className="font-semibold text-xl">Order ID: {order._id}</p>
                                <p className={`px-4 py-1 rounded-full text-sm ${order.status === "Delivered" ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"}`}>
                                    {order.status}
                                </p>
                            </div>

                            <p className="text-gray-400 mb-4">
                                Placed on: {new Date(order.createdAt).toLocaleString()}
                            </p>

                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4 bg-gray-700 p-4 rounded-xl">
                                        <img
                                            src={item.image || "/placeholder.png"}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-400">
                                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-bold text-cyan-400">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end items-center gap-4 text-xl font-bold">
                                Total: $
                                {order.items
                                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                                    .toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
            </main>

            <Footer />
        </div>
    );
}
