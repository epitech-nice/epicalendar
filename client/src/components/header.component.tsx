/**
 * @file header.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useTheme } from "@/contexts/theme.context";

import "./header.component.css";

export default function Header() {
    const { isAuthenticated, logout, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const [menuState, setMenuState] = useState("closed");

    const toggleMenu = () => {
        if (menuState === "open") {
            setMenuState("closing");
            setTimeout(() => setMenuState("closed"), 300); // durée = transition CSS
        } else {
            setMenuState("open");
        }
    };

    return (
        <header>
            {/* Title and logo */}
            <Link href="/" className="home-link">
                {/*<Image
                    width={32}
                    height={32}
                    src="/favicon.ico"
                    alt="EpiCalendar Logo"
                    className="logo"
                />*/}
                <span className="title">{`{EPICALENDAR}`}</span>
            </Link>

            {/* Burger button for mobile */}
            <button
                className="burger"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            {/* Navigation */}
            <div
                className={`menu-container ${
                    menuState === "open"
                        ? "open"
                        : menuState === "closing"
                          ? "closing"
                          : ""
                }`}
            >
                {/* Other pages */}
                <nav className="menu-section nav-center">
                    <Link className={"nav-link"} href="/calendar">
                        Calendar
                    </Link>
                    <Link className={"nav-link"} href="/opening-requests">
                        Opening requests
                    </Link>
                    <Link className={"nav-link"} href="/stuck">
                        I&#39;m stuck
                    </Link>
                    {isAuthenticated && user && (
                        <>
                            {["aer", "admin"].includes(user.role) && (
                                <>
                                    <Link
                                        className={"nav-link"}
                                        href="/manage-days"
                                    >
                                        Manage days
                                    </Link>
                                </>
                            )}
                            {user.role === "admin" && (
                                <Link
                                    className={"nav-link"}
                                    href="/manage-accounts"
                                >
                                    Manage accounts
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                <div className="menu-separator"></div>

                {/* Connection */}
                <nav className="menu-section nav-right">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDark ? "☀" : "☾"}
                    </button>

                    {!isAuthenticated ? (
                        <>
                            <Link className={"nav-link"} href="/login">
                                Sign In
                            </Link>
                            <button
                                className={"nav-button"}
                                onClick={() =>
                                    (window.location.href = "/register")
                                }
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            {user && user.role !== "student" && (
                                <Link className={"nav-link"} href="/profile">
                                    {user.first_name} {user.last_name}
                                </Link>
                            )}
                            {user && user.role === "student" && (
                                <span className="text-white/80 font-medium px-3 py-2">
                                    {user.first_name} {user.last_name}
                                </span>
                            )}
                            <button className={"nav-button"} onClick={logout}>
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
