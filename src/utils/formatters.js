/**
 * Data formatting utilities
 * Used for formatting dates, numbers, text, etc.
 */

import { formatDistanceToNow, format } from 'date-fns';

// Format date to readable format
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format date relative to now
export const formatDateRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Format time
export const formatTime = (date, formatStr = 'HH:mm') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '';
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format time duration in seconds
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalize all words
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Slugify text
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim('-');
};

// Format camelCase to Title Case
export const camelToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

// Format snake_case to Title Case
export const snakeToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Highlight text
export const highlightText = (text, query) => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Format form submission data
export const formatSubmissionData = (data) => {
  if (!data) return {};
  
  const formatted = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      formatted[key] = 'N/A';
    } else if (typeof value === 'boolean') {
      formatted[key] = value ? 'Yes' : 'No';
    } else if (Array.isArray(value)) {
      formatted[key] = value.join(', ');
    } else {
      formatted[key] = value.toString();
    }
  });
  
  return formatted;
};

// Format status badges
export const formatStatus = (status) => {
  const statusMap = {
    draft: { text: 'Draft', color: 'warning' },
    active: { text: 'Active', color: 'success' },
    archived: { text: 'Archived', color: 'secondary' },
    submitted: { text: 'Submitted', color: 'success' },
    failed: { text: 'Failed', color: 'danger' },
  };
  
  return statusMap[status] || { text: status, color: 'secondary' };
};

// Export all formatters
export const formatters = {
  date: formatDate,
  dateRelative: formatDateRelative,
  time: formatTime,
  dateTime: formatDateTime,
  number: formatNumber,
  currency: formatCurrency,
  percentage: formatPercentage,
  duration: formatDuration,
  fileSize: formatFileSize,
  phoneNumber: formatPhoneNumber,
  capitalize,
  capitalizeWords,
  truncate,
  slugify,
  camelToTitle,
  snakeToTitle,
  highlightText,
  submissionData: formatSubmissionData,
  status: formatStatus,
};

export default formatters;
