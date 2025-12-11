import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Base transitions and layout
  const baseStyles = "relative font-semibold transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent hover:bg-accentHover text-white rounded-full shadow-[0_4px_14px_0_rgba(45,125,255,0.39)] hover:shadow-[0_6px_20px_rgba(45,125,255,0.23)] px-8 py-4 text-lg tracking-wide",
    secondary: "bg-[#222] hover:bg-[#333] text-slate-200 border border-[#333] hover:border-slate-500 rounded-xl px-4 py-2 text-sm shadow-sm",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-lg p-2 transition-colors",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Optimizing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
