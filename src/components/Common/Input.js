import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Input.css';

/**
 * Reusable Input Component
 * Supports multiple types, validation, icons, and error states
 */
const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  onFocus,
  error = '',
  disabled = false,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  helper = '',
  maxLength,
  minLength,
  pattern,
  autoComplete,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const handleChange = useCallback((e) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasValue = value && value.toString().length > 0;

  const inputClass = `
    input-field
    input-field--${type}
    ${isFocused ? 'input-field--focused' : ''}
    ${hasError ? 'input-field--error' : ''}
    ${disabled ? 'input-field--disabled' : ''}
    ${hasValue ? 'input-field--filled' : ''}
    ${Icon ? 'input-field--with-icon' : ''}
    ${className}
  `.trim();

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {Icon && iconPosition === 'left' && (
          <Icon 
            className={`input-icon input-icon--${iconPosition} ${hasError ? 'input-icon--error' : ''}`}
            size={20}
          />
        )}

        <input
          ref={ref}
          type={inputType}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}

        {hasError && (
          <AlertCircle 
            className="input-error-icon"
            size={20}
          />
        )}

        {Icon && iconPosition === 'right' && type !== 'password' && (
          <Icon 
            className={`input-icon input-icon--${iconPosition}`}
            size={20}
          />
        )}
      </div>

      {maxLength && (
        <div className="input-counter">
          {value?.length || 0} / {maxLength}
        </div>
      )}

      {error && (
        <div className="input-error">
          {error}
        </div>
      )}

      {helper && !error && (
        <div className="input-helper">
          {helper}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'date',
    'time',
    'url',
    'tel',
    'search',
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  helper: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
