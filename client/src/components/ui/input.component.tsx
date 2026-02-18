interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({
    label,
    error,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text-primary mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-input-text
                    focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20
                    transition-all duration-200 ${error ? "border-status-error" : ""} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-status-error">{error}</p>
            )}
        </div>
    );
}
