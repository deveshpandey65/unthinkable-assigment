'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import productApi from "@/utils/product";
import ProductCard from '@/components/ProductCard';
import Products from '@/components/Products';
import Recomendation from '@/components/Recomendation';
import SearchVoice from '@/components/SearchVoice';
import SeasonalProducts from '@/components/SeasonalProducts';
import withAuth from '@/hoc/withAuth';
import React, { useEffect, useRef, useState } from 'react';
import cartApi from '@/utils/cart';
import Cart from '@/components/Cart';
import CategorySection from '@/components/CategotyProducts';
import CategoryBar from '@/components/CategoryNav';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap the mic to start shopping.');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedItemName, setConfirmedItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const totalItems = useRef(0); // keep as ref

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productApi.getProducts({ page: 1, limit: 20 });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch recommended products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productApi.recommendedProducts();
        setRecommendedProducts(res.items);
      } catch (error) {
        console.error("Error Recommended Products:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartApi.getCart();
        totalItems.current = res.items.length || 0; // ✅ update .current
        setCartItems(res.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, []);

  // Add to Cart (backend API)
  const addToCart = async (product, quantity = 1) => {
    try {
      // Update cart state
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

      totalItems.current += quantity; // ✅ increment totalItems ref

      // Show confirmation message
      setConfirmedItemName(product.name);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);

      // Persist in backend
      await cartApi.addItem({ productId: product._id, quantity });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  };

  // Voice Assistant
  const handleMicClick = () => {
    if (isListening) return;

    setIsListening(true);
    setStatusMessage('Listening for your command...');

    setTimeout(() => {
      setIsListening(false);
      setStatusMessage('Tap the mic to start shopping.');
    }, 2000);
  };

  // Filter products
  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>
      <div className="relative overflow-hidden">
        {/* Header */}
        <Header totalItems={totalItems.current} />

        <div className="w-full mx-auto px-4 md:px-8 space-y-16 pt-28 pb-8">
          <CategoryBar />

          {/* Voice Assistant & Search */}
          
          <SearchVoice
            isListening={isListening}
            handleMicClick={handleMicClick}
            statusMessage={statusMessage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addToCart={addToCart}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <SeasonalProducts searchTerm={searchTerm} addToCart={addToCart} />

              
            </div>

            <Cart
              setCartItems={setCartItems}
              cartItems={cartItems}
              totalItems={totalItems.current}
            />
          </div>

          <div className="space-y-12">
            <CategorySection />
            <Recomendation
              searchTerm={searchTerm}
              recommendedProducts={recommendedProducts}
              addToCart={addToCart}
            />
            <Products filteredProducts={filteredProducts} addToCart={addToCart} />
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white py-3 px-6 rounded-full shadow-lg transition-all duration-500 animate-slide-in-up z-50">
            <p className="font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-8.15" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Added &quot;{confirmedItemName}&quot; to cart!
            </p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default withAuth(App);
