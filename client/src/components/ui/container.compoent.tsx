import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
    children,
    className = "",
    maxWidth = "lg",
}: ContainerProps) {
    const containerClass = {
        sm: "page-container-sm",
        md: "page-container-md",
        lg: "page-container",
        xl: "page-container",
        full: "w-full",
    }[maxWidth];

    return (
        <div className={`${containerClass} ${className}`}>
            {children}
        </div>
    );
}
