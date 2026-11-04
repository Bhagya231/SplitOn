import { useState } from 'react';

function FormInput({label,
  inputType = 'input',
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  disabled = false,
  readOnly = false,
  required = false,
  rows = 3,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const inputClasses = `form-control ${error ? 'is-invalid' : ''} ${className}`.trim();

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {inputType === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          
        />
      ) : (
        <div className={isPassword ? 'position-relative' : ''}>
          <input
            type={actualType}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} ${isPassword ? 'pe-5' : ''}`.trim()}
            disabled={disabled}
            readOnly={readOnly}
        
          />

          {isPassword && (
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none position-absolute top-50 pe-4 end-0 translate-middle-y me-2"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={disabled}
              
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      )}

      {error && (
        <div id={`${name}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}

export default FormInput;
