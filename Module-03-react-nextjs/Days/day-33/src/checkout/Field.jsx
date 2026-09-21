function Field({
    id,
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    type = "text",
    placeholder,
    as = "input"
}) {
    const errorId = `${id}-error`;

    const commonProps = {
        id: id,
        name: name,
        value: value,
        onChange: onChange,
        onBlur: onBlur,
        placeholder: placeholder,
        "aria-invalid": !!error,
        "aria-describedby": error
            ? errorId
            : undefined
    };

    return (
        <div className="form-field">
            <label htmlFor={id}>
                {label}
            </label>

            {as === "textarea" ? (
                <textarea {...commonProps} />
            ) : (
                <input
                    {...commonProps}
                    type={type}
                />
            )}

            {error && (
                <p
                    id={errorId}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default Field;