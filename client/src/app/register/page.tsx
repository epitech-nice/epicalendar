/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button, Input, Card, Alert, Container } from "@/components/ui";

export default function Register() {
    const router = useRouter();

    const { isAuthenticated, register } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
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
            const registerData = {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
            };
            await register(registerData);
            router.push("/");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during registration.",
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
        <main className="min-h-screen flex items-center justify-center py-12">
            <Container maxWidth="sm">
                <div className="mb-8">
                    <h1 className="page-title">Sign Up</h1>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />

                        <Input
                            type="text"
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            placeholder="Your first name"
                        />

                        <Input
                            type="text"
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            placeholder="Your last name"
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
                            <Alert type="error">{error}</Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={responseLoading}
                            className="w-full"
                        >
                            {responseLoading ? "Creating..." : "Create account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-text-secondary">
                        <p>
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-text-tertiary hover:text-primary text-sm">
                            ← Back to home
                        </Link>
                    </div>
                </Card>
            </Container>
        </main>
    );
}
