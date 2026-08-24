/**
 * Form field type definitions and configurations
 */

export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date',
  DATETIME: 'datetime',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
  URL: 'url',
  PHONE: 'phone',
  PASSWORD: 'password',
};

export const FIELD_TYPE_CONFIGS = {
  [FIELD_TYPES.TEXT]: {
    label: 'Short Text',
    icon: 'Type',
    description: 'Single line text input',
    placeholder: 'Enter text',
    defaultCharLimit: 100,
    allowCharLimit: true,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.EMAIL]: {
    label: 'Email',
    icon: 'Mail',
    description: 'Email input field',
    placeholder: 'example@email.com',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.TEXTAREA]: {
    label: 'Long Text',
    icon: 'FileText',
    description: 'Multi-line text input',
    placeholder: 'Enter detailed text',
    defaultCharLimit: 500,
    allowCharLimit: true,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.NUMBER]: {
    label: 'Number',
    icon: 'Hash',
    description: 'Numeric input field',
    placeholder: '0',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.DATE]: {
    label: 'Date',
    icon: 'Calendar',
    description: 'Date picker field',
    placeholder: 'Select date',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: false,
  },
  [FIELD_TYPES.DATETIME]: {
    label: 'Date & Time',
    icon: 'Clock',
    description: 'Date and time picker',
    placeholder: 'Select date and time',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: false,
  },
  [FIELD_TYPES.DROPDOWN]: {
    label: 'Dropdown',
    icon: 'ChevronDown',
    description: 'Dropdown selection field',
    placeholder: 'Select an option',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
    requiresOptions: true,
  },
  [FIELD_TYPES.CHECKBOX]: {
    label: 'Checkbox',
    icon: 'Square',
    description: 'Checkbox field',
    placeholder: null,
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: false,
    requiresOptions: true,
  },
  [FIELD_TYPES.RADIO]: {
    label: 'Radio Button',
    icon: 'Circle',
    description: 'Radio button selection',
    placeholder: null,
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: false,
    requiresOptions: true,
  },
  [FIELD_TYPES.FILE]: {
    label: 'File Upload',
    icon: 'Upload',
    description: 'File upload field',
    placeholder: 'Choose file',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: false,
  },
  [FIELD_TYPES.URL]: {
    label: 'URL',
    icon: 'Link',
    description: 'URL input field',
    placeholder: 'https://example.com',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.PHONE]: {
    label: 'Phone Number',
    icon: 'Phone',
    description: 'Phone number input',
    placeholder: '(123) 456-7890',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
  },
  [FIELD_TYPES.PASSWORD]: {
    label: 'Password',
    icon: 'Lock',
    description: 'Password input field',
    placeholder: '••••••••',
    defaultCharLimit: null,
    allowCharLimit: false,
    allowPlaceholder: true,
  },
};

// Get all field types as array
export const getFieldTypesList = () => {
  return Object.entries(FIELD_TYPE_CONFIGS).map(([type, config]) => ({
    type,
    ...config,
  }));
};

// Get field type config
export const getFieldTypeConfig = (type) => {
  return FIELD_TYPE_CONFIGS[type] || null;
};

// Check if field requires options
export const fieldRequiresOptions = (type) => {
  return FIELD_TYPE_CONFIGS[type]?.requiresOptions || false;
};

// Get field icon
export const getFieldIcon = (type) => {
  return FIELD_TYPE_CONFIGS[type]?.icon || 'Type';
};

// Field validation rules
export const FIELD_VALIDATION_RULES = {
  [FIELD_TYPES.EMAIL]: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  [FIELD_TYPES.URL]: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'Please enter a valid URL',
  },
  [FIELD_TYPES.PHONE]: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: 'Please enter a valid phone number',
  },
};

export default {
  FIELD_TYPES,
  FIELD_TYPE_CONFIGS,
  getFieldTypesList,
  getFieldTypeConfig,
  fieldRequiresOptions,
  getFieldIcon,
  FIELD_VALIDATION_RULES,
};
