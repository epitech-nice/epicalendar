import { ReactNode } from "react";

interface AlertProps {
    children: ReactNode;
    type?: "success" | "error" | "warning" | "info";
    className?: string;
}

export function Alert({ children, type = "info", className = "" }: AlertProps) {
    const types = {
        success: "bg-status-success-bg text-status-success border-status-success",
        error: "bg-status-error-bg text-status-error border-status-error",
        warning:
            "bg-status-warning-bg text-status-warning border-status-warning",
        info: "bg-status-info-bg text-status-info border-status-info",
    };

    return (
        <div
            className={`px-4 py-3 rounded-lg border ${types[type]} ${className}`}
            role="alert"
        >
            {children}
        </div>
    );
}