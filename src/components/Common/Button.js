import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Reusable Button Component
 * Supports multiple variants, sizes, states, and icons
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const buttonClass = `
    btn
    btn--${variant}
    btn--${size}
    ${disabled ? 'btn--disabled' : ''}
    ${loading ? 'btn--loading' : ''}
    ${fullWidth ? 'btn--full-width' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="btn__content">
        {loading ? (
          <span className="btn__spinner" />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className="btn__icon" size={20} />
        ) : null}

        {children && <span className="btn__text">{children}</span>}

        {Icon && iconPosition === 'right' && !loading ? (
          <Icon className="btn__icon" size={20} />
        ) : null}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'ghost',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
