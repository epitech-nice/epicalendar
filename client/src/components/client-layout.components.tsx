/**
 * @file clientLayout.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header.components";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const shouldHideHeader = pathname.startsWith("/dashboard");

    return (
        <>
            {!shouldHideHeader && <Header />}
            {children}
        </>
    );
}
