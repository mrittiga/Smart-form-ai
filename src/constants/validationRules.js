/**
 * Advanced Validation Rules
 * Reusable validation patterns and rules
 */

export const VALIDATION_RULES = {
  // Email patterns
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },

  // URL patterns
  URL: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
    message: 'Please enter a valid URL',
  },

  // Phone patterns
  PHONE: {
    pattern: /^[\d\s\-\+\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },

  // Password (strong)
  PASSWORD_STRONG: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must contain uppercase, lowercase, number, and special character',
  },

  // Username
  USERNAME: {
    pattern: /^[a-zA-Z0-9_-]{3,16}$/,
    message: 'Username must be 3-16 characters (letters, numbers, dash, underscore)',
  },

  // Zip code
  ZIPCODE: {
    pattern: /^\d{5}(-\d{4})?$/,
    message: 'Please enter a valid zip code',
  },

  // Credit card
  CREDIT_CARD: {
    pattern: /^\d{13,19}$/,
    message: 'Please enter a valid credit card number',
  },

  // Social Security Number
  SSN: {
    pattern: /^\d{3}-\d{2}-\d{4}$/,
    message: 'Please enter a valid SSN (XXX-XX-XXXX)',
  },

  // Date (YYYY-MM-DD)
  DATE: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Please enter a valid date (YYYY-MM-DD)',
  },

  // Time (HH:MM)
  TIME: {
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: 'Please enter a valid time (HH:MM)',
  },

  // Hex color
  HEX_COLOR: {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    message: 'Please enter a valid hex color',
  },

  // IPv4
  IPV4: {
    pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
    message: 'Please enter a valid IPv4 address',
  },

  // UUID
  UUID: {
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    message: 'Please enter a valid UUID',
  },

  // Alphanumeric only
  ALPHANUMERIC: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers allowed',
  },

  // No special characters
  NO_SPECIAL_CHARS: {
    pattern: /^[a-zA-Z0-9\s\-']+$/,
    message: 'Special characters not allowed',
  },

  // Numbers only
  NUMBERS_ONLY: {
    pattern: /^\d+$/,
    message: 'Only numbers allowed',
  },

  // Letters only
  LETTERS_ONLY: {
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Only letters allowed',
  },
};

// Length validation
export const LENGTH_RULES = {
  MIN_3: { min: 3, message: 'Must be at least 3 characters' },
  MIN_6: { min: 6, message: 'Must be at least 6 characters' },
  MIN_8: { min: 8, message: 'Must be at least 8 characters' },
  MAX_50: { max: 50, message: 'Must not exceed 50 characters' },
  MAX_100: { max: 100, message: 'Must not exceed 100 characters' },
  MAX_500: { max: 500, message: 'Must not exceed 500 characters' },
  BETWEEN_3_50: { min: 3, max: 50, message: 'Must be between 3 and 50 characters' },
  BETWEEN_6_100: { min: 6, max: 100, message: 'Must be between 6 and 100 characters' },
};

// Custom validators
export const createValidator = (rule) => (value) => {
  if (!value) return true;

  const { pattern, message } = rule;
  if (!pattern.test(value)) {
    return message;
  }

  return true;
};

export const createLengthValidator = (rule) => (value) => {
  if (!value) return true;

  const { min, max, message } = rule;

  if (min && value.length < min) {
    return `Must be at least ${min} characters`;
  }

  if (max && value.length > max) {
    return `Must not exceed ${max} characters`;
  }

  return true;
};

// Composite validator
export const createCompositeValidator = (...validators) => (value) => {
  for (const validator of validators) {
    const result = validator(value);
    if (result !== true) {
      return result;
    }
  }
  return true;
};

export default {
  VALIDATION_RULES,
  LENGTH_RULES,
  createValidator,
  createLengthValidator,
  createCompositeValidator,
};
