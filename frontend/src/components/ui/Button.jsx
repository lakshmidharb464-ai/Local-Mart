import React from 'react';

/**
 * Standardized Unified Button Component for LocalFarm Direct
 * Replaces 8 competing button gradients with cohesive design tokens.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Base physics & layout
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farmGreen-500 focus-visible:ring-offset-2';

  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-full gap-1.5',
    md: 'px-5 py-2.5 text-xs rounded-full gap-2',
    lg: 'px-7 py-3.5 text-sm rounded-full gap-2.5',
    icon: 'w-10 h-10 rounded-full p-0',
  };

  // Color & Gradient variants
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-farmGreen-800 to-farmGreen-600 text-white shadow-farm-sm hover:shadow-farm-md hover:from-farmGreen-700 hover:to-farmGreen-500 border border-farmGreen-500/30',
    gold:
      'bg-gradient-to-r from-farmGold-600 to-farmGold-500 text-farmGreen-950 font-extrabold shadow-md hover:shadow-gold-glow hover:from-farmGold-500 hover:to-farmGold-400 border border-farmGold-400/40',
    secondary:
      'bg-white text-farmGreen-900 border border-farmGreen-200 shadow-xs hover:bg-farmGreen-50 hover:border-farmGreen-300',
    outline:
      'bg-transparent text-farmGreen-700 border border-farmGreen-600/60 hover:bg-farmGreen-50/80',
    ghost:
      'bg-transparent text-farmMuted hover:text-farmGreen-900 hover:bg-farmGreen-100/50',
    danger:
      'bg-rose-600 text-white shadow-sm hover:bg-rose-700 border border-rose-700',
    glow:
      'bg-farmGreen-700 text-white shadow-farm-md hover:shadow-farm-lg btn-glow',
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;
  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children && <span>{children}</span>}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
