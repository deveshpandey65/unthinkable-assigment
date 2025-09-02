import React from 'react'

export default function Header({ totalItems }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 py-4 px-8 md:px-12 flex justify-between items-center shadow-lg transition-all duration-300">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">ShopSmart</h1>
            <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-110">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                        {totalItems}
                    </span>
                )}
            </div>
        </header>
    );
}
