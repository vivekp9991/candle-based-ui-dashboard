export const formatCurrency = (value, currency = 'USD') => {
  // Handle undefined, null, or non-numeric values
  if (value === undefined || value === null || isNaN(value)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(0);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
};

export const formatPercent = (value, decimals = 2) => {
  // Handle undefined, null, or non-numeric values
  if (value === undefined || value === null || isNaN(value) || typeof value !== 'number') {
    return '0.00%';
  }
  
  // Additional safety check
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return '0.00%';
  }
  
  return `${numValue.toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 2) => {
  // Handle undefined, null, or non-numeric values
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatDate = (date, options = {}) => {
  if (!date) {
    return 'N/A';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  try {
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatCompactNumber = (value) => {
  // Handle undefined, null, or non-numeric values
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};