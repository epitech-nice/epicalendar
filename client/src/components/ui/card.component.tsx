import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
    children,
    className = "",
    padding = "md",
}: CardProps) {
    const paddings = {
        none: "",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={`bg-card-bg border border-card-border rounded-xl shadow-sm ${paddings[padding]} ${className}`}
        >
            {children}
        </div>
    );
}