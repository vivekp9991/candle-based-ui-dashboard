import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CompactCard = ({ title, value, subtitle, icon: Icon, trend, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-3 text-white shadow-sm card-shadow`}>
    <div className="flex items-center justify-between mb-1">
      <Icon className="w-4 h-4" />
      {trend !== undefined && (
        trend >= 0 ? 
          <TrendingUp className="w-3 h-3 text-green-200" /> : 
          <TrendingDown className="w-3 h-3 text-red-200" />
      )}
    </div>
    <p className="text-xs opacity-90">{title}</p>
    <p className="text-base sm:text-lg font-bold leading-tight">{value}</p>
    {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
  </div>
);

export default CompactCard;