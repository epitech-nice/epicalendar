import { ReactNode } from "react";

interface AlertProps {
    children: ReactNode;
    type?: "success" | "error" | "warning" | "info";
    className?: string;
}

export function Alert({ children, type = "info", className = "" }: AlertProps) {
    const typeClass = {
        success: "alert-success",
        error: "alert-error",
        warning: "alert-warning",
        info: "alert-info",
    }[type];

    return (
        <div className={`${typeClass} ${className}`} role="alert">
            {children}
        </div>
    );
}
