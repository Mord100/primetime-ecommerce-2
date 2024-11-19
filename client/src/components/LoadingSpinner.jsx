import React from 'react';
import { ShoppingBag } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-4">
      <div className="relative">
        <ShoppingBag 
          size={36} 
          className="text-red-600 animate-bounce" 
        />

      </div>
      <span className="text-sm font-medium text-gray-600">
        Loading products...
      </span>
    </div>
  );
};

export default LoadingSpinner;