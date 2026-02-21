/**
 * @file loading.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="spinner" />
            <span
                style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}
            >
                Loading...
            </span>
        </div>
    );
}
