"use client";

import Header from "@/components/header";
import { usePathname } from "next/navigation";

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
