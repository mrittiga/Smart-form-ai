/**
 * General helper functions used throughout the application
 */

// Check if user is online
export const isOnline = () => navigator.onLine;

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Failed to copy:', error);
    return { success: false, error };
  }
};

// Download file
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate UUID
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Debounce function
export const debounce = (func, wait = 500) => {
  let timeout;
  
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle function
export const throttle = (func, limit = 500) => {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Sleep/delay
export const sleep = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function
export const retry = async (
  fn,
  options = { retries: 3, delay: 1000 }
) => {
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === options.retries - 1) throw error;
      await sleep(options.delay);
    }
  }
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Merge objects
export const mergeObjects = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeObjects(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

// Check if value is object
export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

// Get nested value from object
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

// Set nested value in object
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
};

// Filter object by keys
export const filterObject = (obj, keys) => {
  const result = {};
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

// Group array by property
export const groupBy = (arr, property) => {
  return arr.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

// Sort array of objects
export const sortBy = (arr, property, order = 'asc') => {
  const sorted = [...arr];
  
  sorted.sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (typeof aVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
  
  return sorted;
};

// Remove duplicates from array
export const removeDuplicates = (arr, property = null) => {
  if (property) {
    return arr.filter(
      (item, index, self) =>
        index === self.findIndex(t => t[property] === item[property])
    );
  }
  
  return [...new Set(arr)];
};

// Flatten array
export const flattenArray = (arr) => {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
};

// Get object differences
export const getObjectDifferences = (obj1, obj2) => {
  const differences = {};
  
  const allKeys = new Set([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);
  
  allKeys.forEach(key => {
    if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      differences[key] = {
        old: obj1[key],
        new: obj2[key],
      };
    }
  });
  
  return differences;
};

// Export all helpers
export const helpers = {
  isOnline,
  copyToClipboard,
  downloadFile,
  generateId,
  generateUUID,
  debounce,
  throttle,
  sleep,
  retry,
  deepClone,
  mergeObjects,
  isObject,
  getNestedValue,
  setNestedValue,
  filterObject,
  groupBy,
  sortBy,
  removeDuplicates,
  flattenArray,
  getObjectDifferences,
};

export default helpers;
