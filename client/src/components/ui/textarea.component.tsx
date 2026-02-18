interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({
    label,
    error,
    className = "",
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={textareaId} className="form-label">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`form-textarea ${error ? "form-input-error" : ""} ${className}`}
                {...props}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
