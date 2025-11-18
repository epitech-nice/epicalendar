"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

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
