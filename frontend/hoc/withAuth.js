"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const withAuth = (WrappedComponent) => {
    const AuthHOC = (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");

                if (!token) {
                    router.push("/login"); // redirect if no token
                    return;
                }

                const verifyToken = async () => {
                    try {
                        // ✅ Use correct method (GET or POST based on backend)
                        const res = await api.get("/auth/verify", {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (res.status === 200) {
                            setLoading(false);
                        } else {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }
                    } catch (err) {
                        console.error("Error verifying token:", err);
                        localStorage.removeItem("token");
                        router.push("/login");
                    }
                };

                verifyToken();
            }
        }, [router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthHOC;
};

export default withAuth;
