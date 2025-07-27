export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-500';
    case 'upcoming': return 'bg-yellow-500';
    case 'pending': return 'bg-gray-300';
    default: return 'bg-gray-300';
  }
};

export const getDotSize = (frequency) => {
  switch (frequency) {
    case 'monthly': return 'w-3 h-3';
    case 'quarterly': return 'w-4 h-4';
    case 'half-yearly': return 'w-5 h-5';
    case 'annually': return 'w-6 h-6';
    default: return 'w-3 h-3';
  }
};

export const getFrequencyLabel = (frequency) => {
  switch (frequency) {
    case 'monthly': return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'half-yearly': return 'Semi-Annual';
    case 'annually': return 'Annual';
    default: return frequency;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};