import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover px-6 py-3",
    secondary: "bg-slate-100 text-text-main border border-slate-200 hover:bg-slate-200 px-6 py-3",
    danger: "bg-red-600 text-white hover:bg-red-700 px-6 py-3 shadow-red-500/30",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
