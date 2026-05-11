import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  id,
  className = '',
  wrapperClassName = '',
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-bold text-text-main mb-2"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        ref={ref}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-main font-medium ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
