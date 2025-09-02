"use client";
import api from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

export default function SearchVoice({
    isListening,
    handleMicClick,
    statusMessage,
    searchTerm,
    setSearchTerm,
    addToCart
}) {
    const recognitionRef = useRef(null);
    const [language, setLanguage] = useState("en");
    const [capturedText, setCapturedText] = useState("");
    const capturedTextRef = useRef("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setCapturedText(transcript);
            capturedTextRef.current = transcript;
            console.log(transcript)
        };

        async function handleFindTask(text) {
            try {
                const res = await api.post("/find", { text });
                const items = res.data.data || [];
                setSearchResults(items);

                let replyText = "";
                if (items.length === 0) {
                    replyText = "No items found for your search.";
                } else {
                    replyText = `Found ${items.length} items.`;
                }

                const utterance = new SpeechSynthesisUtterance(replyText);
                utterance.lang = language;
                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.error("Find task API failed:", err);
            }
        }

        recognition.onend = async () => {
            if (capturedTextRef.current) {
                const text = capturedTextRef.current.toLowerCase();

                if (language=='en' && text.includes("find")) {
                    await handleFindTask(text,language);
                } else if (language == 'hi' && text.includes("खोजो")) {
                    await handleFindTask(text, language);
                }
                else if (language == 'bn' && text.includes("খুঁজুন")) {
                    await handleFindTask(text, language);
                }
                 else {
                    try {
                        const res = await api.post('/voice', { text,language });
                        const replyText = res.data.message;
                        const utterance = new SpeechSynthesisUtterance(replyText);
                        utterance.lang = language;
                        window.speechSynthesis.speak(utterance);
                    } catch (error) {
                        console.error("API request failed:", error);
                    }
                }

                capturedTextRef.current = "";
                setCapturedText("");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current = recognition;
    }, [language]);

    const toggleMic = () => {
        if (!recognitionRef.current) return;

        if (!isListening) {
            recognitionRef.current.lang = language;
            recognitionRef.current.start();
            handleMicClick(true);
        } else {
            recognitionRef.current.stop();
            handleMicClick(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 w-full">
                {/* Microphone Button */}
                <button
                    className={`p-6 rounded-full transition-all duration-300 shadow-lg ${isListening
                        ? "bg-red-500 animate-pulse-fast transform scale-110"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    onClick={toggleMic}
                    style={{ animationDuration: '1s' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mic text-white"
                    >
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                </button>

                {/* Status Message and Search Bar */}
                <div className="flex-1 w-full flex flex-col items-center md:items-start space-y-4">
                    <p className="text-xl md:text-2xl font-semibold text-gray-800 text-center md:text-left">
                        {statusMessage}
                    </p>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-200 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                            className="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Language Selector */}
            <div className="w-full mt-6 flex justify-center">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-200 text-gray-800 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    <option value="en">English (US)</option>
                    <option value="hi">Hindi (India)</option>
                    <option value="bn">Bengali (India)</option>
                </select>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((item) => (
                        <ProductCard key={item._id} product={item} addToCart={addToCart} />
                    ))}
                </div>
            )}
        </div>
    );
}