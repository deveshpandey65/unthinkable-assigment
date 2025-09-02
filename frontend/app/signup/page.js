'use client'
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
// Main App component for the signup page.
const App = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // New state for the user's role
    const router =useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await api.post("/auth/signup", {
                fullName,
                email,
                password,
                role,
            });

            if (res.data.success) {
                
                alert("Signup successful!");
                router.push('/login')
                // redirect or clear form if needed
            } else {
                alert(res.data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error("Signup error:", err);

            if (err.response && err.response.data) {
                alert(err.response.data.message || "Signup failed");
            } else {
                alert("Network error, please try again later.");
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

                {/* Animated circles for a modern, techy feel */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-12 left-8 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="flex flex-col items-center mb-8">
                    {/* Logo or icon section. */}
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mb-4 shadow-lg transition-transform duration-500 hover:rotate-6">
                        <span className="text-2xl font-black">N</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Create an Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm animate-fade-in animation-delay-500">
                        Sign up to get started.
                    </p>
                </div>

                {/* The signup form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name input field */}
                    <div className="relative">
                        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="peer block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                                placeholder="John Doe"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-indigo-600">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

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
                                autoComplete="new-password"
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

                    {/* Confirm Password input field */}
                    <div className="relative">
                        <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                            Confirm Password
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="peer block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                                placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-indigo-600">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Role selection dropdown */}
                    <div className="relative">
                        <label htmlFor="role" className="block text-sm font-medium mb-1">
                            Role
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <select
                                id="role"
                                name="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="peer block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 peer-focus:text-indigo-600">
                                <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            </div>
                        </div>
                    </div>


                    {/* The signup button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            Sign up
                            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </button>
                    </div>
                </form>

                {/* Link back to login page */}
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
