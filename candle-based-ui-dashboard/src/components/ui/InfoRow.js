import React from 'react';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs text-gray-600">{label}</span>
    <span className="text-xs font-semibold text-gray-800">{value}</span>
  </div>
);

export default InfoRow;