import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Button } from './Button';

/**
 * Standardized Friendly Empty State Component for LocalFarm Direct
 */
export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your filters or search keywords to find what you need.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-16 px-6 bg-white/80 backdrop-blur-md rounded-[28px] border border-farmGreen-700/10 shadow-organic max-w-lg mx-auto flex flex-col items-center justify-center animate-fadeIn ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-farmGreen-50 text-farmGreen-700 flex items-center justify-center mb-4 shadow-inner border border-farmGreen-200/60">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="font-display font-extrabold text-lg text-farmGreen-950 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-farmMuted max-w-xs mb-6 leading-relaxed font-body">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} icon={Sparkles}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
