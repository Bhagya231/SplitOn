

function FormInput({label,name,type = "text", value, onChange,placeholder = "",required = false, error ="", ...props})
{
    return (
         <div className="mb-3">
            {label && (
                <label htmlFor={name} className="form-label fw-semibold">
                {label}
                {required && <span className="text-danger"> *</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`form-control ${error ? "is-invalid" : ""}`}
                {...props}
            />

            {error && (
                <div className="invalid-feedback">
                {error}
                </div>
            )}
        </div>
    );
    

}


export default FormInput;

