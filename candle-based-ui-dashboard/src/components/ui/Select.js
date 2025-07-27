import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  icon: Icon, 
  className = '',
  error,
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
        )}
        <select
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-7' : 'pl-2'} pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 appearance-none ${error ? 'border-red-500' : ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;