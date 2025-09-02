'use client'
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
// Main App component for the login page. This is a single component to keep the file self-contained.
const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router=useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", { email, password });

            // Save token
            localStorage.setItem("token", res.data.token);
            console.log(res.data)
            console.log(res.data.user.role)
            if (res.data.user.role=='admin'){
                console.log('addddmin')
                 router.push("/admin");
            }
            else{
                router.push("/");

            }
            // Redirect (React Router example)
        } catch (err) {
            // Network error (server down, no internet, CORS issue, etc.)
            if (!err.response) {
                alert("Network error! Please check your connection.");
            }
            // API returned an error response
            else {
                const status = err.response.status;
                const message = err.response.data?.message || "Something went wrong";

                if (status === 400) {
                    alert("Invalid request. Please check your input.");
                } else if (status === 401) {
                    alert("Invalid credentials. Please try again.");
                } else if (status === 500) {
                    alert("Server error! Try again later.");
                } else {
                    alert(message);
                }
            }
        }
    };



    return (
        // Main container with a dynamic, multi-layered background.
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 font-sans text-gray-800 dark:text-gray-200">
            {/* Visual background element for extra flair */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-200 via-white dark:from-gray-800 dark:via-gray-950 opacity-50 z-0 animate-fade-in"></div>

            {/* The main card container with a frosted glass effect and improved shadow. */}
            <div className="relative w-full max-w-sm mx-auto bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8 sm:p-10 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-3xl z-10">

                {/* Animated circle for a modern, techy feel */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-12 left-8 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="flex flex-col items-center mb-8">
                    {/* Logo or icon section. */}
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mb-4 shadow-lg transition-transform duration-500 hover:rotate-6">
                        <span className="text-2xl font-black">N</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Welcome Back!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-fade-in animation-delay-500">
                        Sign in to your account with a single click.
                    </p>
                </div>

                {/* The login form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email input field */}
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                                placeholder="you@example.com"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-indigo-600">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Password input field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                                placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-indigo-600">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Forgot password and remember me section */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300 select-none">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                            Forgot password?
                        </a>
                    </div>

                    {/* The login button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            Sign in
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </button>
                    </div>
                </form>

                {/* Link to sign up page */}
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        {"Don't have an account? "}
                        <a href="/signup" className="...">Sign up</a>
                    </p>

                </div>
            </div>

            
        </div>
    );
};

export default App;
