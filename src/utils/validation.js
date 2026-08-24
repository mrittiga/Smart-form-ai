/**
 * Comprehensive form validation utilities
 * Used for form fields, user inputs, and data validation
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};

// Calculate password strength
export const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return {
    level: levels[strength] || 'Very Weak',
    percentage: (strength / 6) * 100,
  };
};

// Full name validation
export const validateFullName = (name) => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Full name must not exceed 100 characters' };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: 'Full name contains invalid characters' };
  }
  
  return { isValid: true };
};

// Form title validation
export const validateFormTitle = (title) => {
  if (!title || title.trim().length < 3) {
    return { isValid: false, error: 'Form title must be at least 3 characters' };
  }
  
  if (title.length > 100) {
    return { isValid: false, error: 'Form title must not exceed 100 characters' };
  }
  
  return { isValid: true };
};

// Field label validation
export const validateFieldLabel = (label) => {
  if (!label || label.trim().length < 2) {
    return { isValid: false, error: 'Field label must be at least 2 characters' };
  }
  
  if (label.length > 100) {
    return { isValid: false, error: 'Field label must not exceed 100 characters' };
  }
  
  return { isValid: true };
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// Number validation
export const validateNumber = (value, min = null, max = null) => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  
  if (min !== null && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== null && num > max) {
    return { isValid: false, error: `Must not exceed ${max}` };
  }
  
  return { isValid: true };
};

// Signup form validation
export const validateSignupForm = (data) => {
  const errors = {};
  
  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Validate full name
  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  } else {
    const nameValidation = validateFullName(data.fullName);
    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.error;
    }
  }
  
  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Login form validation
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Form field validation based on type
export const validateFormField = (value, field) => {
  const { field_type, character_limit, is_required } = field;
  
  // Check required
  if (is_required && (!value || value.toString().trim() === '')) {
    return { isValid: false, error: 'This field is required' };
  }
  
  // Check character limit
  if (character_limit && value && value.toString().length > character_limit) {
    return {
      isValid: false,
      error: `Maximum ${character_limit} characters allowed`,
    };
  }
  
  // Type-specific validation
  switch (field_type) {
    case 'email':
      if (value && !validateEmail(value)) {
        return { isValid: false, error: 'Invalid email format' };
      }
      break;
      
    case 'url':
      if (value) {
        const urlValidation = validateURL(value);
        if (!urlValidation.isValid) {
          return urlValidation;
        }
      }
      break;
      
    case 'number':
      if (value) {
        const numValidation = validateNumber(value);
        if (!numValidation.isValid) {
          return numValidation;
        }
      }
      break;
      
    default:
      break;
  }
  
  return { isValid: true };
};

// Export all validators as object
export const validators = {
  email: validateEmail,
  password: validatePassword,
  fullName: validateFullName,
  formTitle: validateFormTitle,
  fieldLabel: validateFieldLabel,
  url: validateURL,
  number: validateNumber,
  signupForm: validateSignupForm,
  loginForm: validateLoginForm,
  formField: validateFormField,
};

export default validators;
