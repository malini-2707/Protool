import React from 'react';

/**
 * Loading Spinner Component
 * Used for loading states throughout the application
 */
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClasses[size]}`}></div>
        {text && <p className="mt-2 text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
