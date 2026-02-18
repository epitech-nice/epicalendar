"use client";

/**
 * @file page.tsx
 * @brief EpiCalendar — web application to manage schedules, opening requests,
 * accounts and presence for Epitech students and staff. Offers calendar
 * views, account management, day management, opening-requests workflow,
 * image uploads, and integrations with the Epitech intranet and Office365.
 * Built with Next.js, React, TypeScript, Tailwind CSS and a Node.js backend.
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button, Input, Alert } from "@/components/ui";

export default function Login() {
    const router = useRouter();

    const { isAuthenticated, login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        try {
            await login(formData);
            router.push("/");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during login.",
            );
        } finally {
            setResponseLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    return (
        <main className="auth-page">
            <div className="auth-card">
                {/* Header */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">Access your EpiCalendar account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@epitech.eu"
                    />

                    <Input
                        type="password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Your password"
                    />

                    {error && (
                        <Alert type="error" className="mb-4">{error}</Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={responseLoading}
                        className="btn-full btn-lg"
                        style={{ marginTop: '0.5rem' }}
                    >
                        {responseLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="auth-divider" />

                <p className="auth-footer-text">
                    Don&#39;t have an account?{" "}
                    <Link href="/register" className="auth-link">
                        Sign up
                    </Link>
                </p>
                <p className="auth-footer-text" style={{ marginTop: '0.5rem' }}>
                    <Link href="/" className="back-link">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </main>
    );
}
