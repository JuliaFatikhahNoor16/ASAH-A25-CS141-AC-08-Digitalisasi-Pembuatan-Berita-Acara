// components/common/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const iconColors = {
    blue: 'text-blue-100',
    green: 'text-green-100',
    yellow: 'text-yellow-100',
    red: 'text-red-100',
    purple: 'text-purple-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.value > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <span className={`text-xl ${iconColors[color]}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;