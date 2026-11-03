
function Button({children,  type = 'button',variant = '',size = 'medium',loading = false,disabled = false,onClick,className = '',})
{
  const buttonClasses = ['btn',`btn-${variant}`,size === 'small' ? 'btn-sm' : '', size === 'large' ? 'btn-lg' : '',className,].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}>

      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"/>
      )}

      {loading ? 'Please wait...' : children}
    </button>
  );
}

export default Button;
