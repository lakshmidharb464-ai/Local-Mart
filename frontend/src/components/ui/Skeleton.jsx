import React from 'react';

/**
 * Standardized Shimmer Skeleton Loading Primitives for LocalFarm Direct
 */
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`bg-gradient-to-r from-farmGreen-100/40 via-farmGreen-200/50 to-farmGreen-100/40 bg-[length:400%_100%] animate-shimmer rounded-2xl ${className}`}
    {...props}
  />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-[24px] border border-farmGreen-700/10 overflow-hidden p-4 shadow-organic flex flex-col gap-4">
    <Skeleton className="w-full h-44 rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="w-24 h-4 rounded-full" />
      <Skeleton className="w-4/5 h-5 rounded-lg" />
      <Skeleton className="w-1/2 h-3.5 rounded-lg" />
    </div>
    <div className="pt-3 border-t border-farmGreen-100/60 flex items-center justify-between">
      <Skeleton className="w-16 h-6 rounded-lg" />
      <Skeleton className="w-24 h-8 rounded-full" />
    </div>
  </div>
);

export const OrderRowSkeleton = () => (
  <div className="bg-white p-5 rounded-2xl border border-farmGreen-100 shadow-organic flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-1.5">
        <Skeleton className="w-32 h-4 rounded-md" />
        <Skeleton className="w-48 h-3.5 rounded-md" />
      </div>
    </div>
    <div className="space-y-1.5 text-right">
      <Skeleton className="w-16 h-5 rounded-md ml-auto" />
      <Skeleton className="w-20 h-4 rounded-full ml-auto" />
    </div>
  </div>
);

export default Skeleton;
