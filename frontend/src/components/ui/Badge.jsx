import React from 'react';
import { Leaf } from 'lucide-react';

/**
 * Standardized Unified Badge Component for LocalFarm Direct
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    organic:
      'bg-farmGreen-50 text-farmGreen-950 border border-farmGreen-300 font-extrabold shadow-xs',
    success:
      'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold',
    warning:
      'bg-farmGold-50 text-farmGold-950 border border-farmGold-300 font-bold',
    danger:
      'bg-rose-50 text-rose-950 border border-rose-300 font-bold',
    info:
      'bg-sky-50 text-sky-950 border border-sky-300 font-bold',
    gold:
      'bg-gradient-to-r from-farmGold-100 to-farmGold-200 text-farmGold-950 border border-farmGold-400/50 font-extrabold shadow-xs',
    neutral:
      'bg-gray-100 text-gray-900 border border-gray-300 font-semibold',
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;
  const selectedVariant = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-display ${selectedSize} ${selectedVariant} ${className}`}
    >
      {variant === 'organic' && !Icon && <Leaf className="w-3 h-3 text-farmGreen-600 shrink-0" />}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
