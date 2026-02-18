import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    variant?: "default" | "primary" | "accent";
}

export function Card({
    children,
    className = "",
    padding = "md",
    variant = "default",
}: CardProps) {
    const paddings = {
        none: "",
        sm: "p-3",
        md: "",      /* padding defined in .card CSS class */
        lg: "p-8",
    };

    const variantClass = {
        default: "card",
        primary: "card-primary",
        accent: "card-accent-left",
    }[variant];

    return (
        <div className={`${variantClass} ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
}