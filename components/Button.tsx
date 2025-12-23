import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = "relative font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary: "bg-accent hover:bg-accentHover text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 border border-white/10",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white",
    outline: "bg-transparent border border-white/20 text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg",
    md: "text-sm px-5 py-2.5 rounded-xl",
    lg: "text-base px-8 py-4 rounded-2xl"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon && <span className="w-4 h-4">{icon}</span>}
      <span>{children}</span>

      {/* Shine effect for primary buttons */}
      {variant === 'primary' && !disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </button>
  );
};

export default Button;
