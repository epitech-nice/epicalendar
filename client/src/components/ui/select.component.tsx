interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({
    label,
    error,
    options,
    className = "",
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-text-primary mb-1.5"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-input-text
                    focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20
                    transition-all duration-200 ${error ? "border-status-error" : ""} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-status-error">{error}</p>
            )}
        </div>
    );
}
