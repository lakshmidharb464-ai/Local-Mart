import React from 'react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

/**
 * ProductGrid — renders a responsive grid of ProductCards with loading/empty states.
 *
 * @param {object} props
 * @param {Array} props.products - Array of product objects.
 * @param {boolean} [props.isLoading] - Show skeleton cards while loading.
 * @param {number} [props.skeletonCount=8] - Number of skeleton cards to show.
 * @param {function} [props.onQuickView]
 * @param {Array} [props.wishlistedIds=[]] - Product IDs in wishlist.
 * @param {function} [props.onToggleWishlist]
 * @param {string} [props.currencySymbol='₹']
 * @param {string} [props.emptyTitle] - Custom empty state heading.
 * @param {string} [props.emptyMessage] - Custom empty state message.
 * @param {React.ReactNode} [props.emptyAction] - Action element for empty state.
 */
export function ProductGrid({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  onQuickView,
  wishlistedIds = [],
  onToggleWishlist,
  currencySymbol = '₹',
  emptyTitle = 'No products found',
  emptyMessage = 'Try adjusting your search or removing a filter.',
  emptyAction,
}) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      aria-label={`${products.length} products`}
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          isWishlisted={wishlistedIds.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          currencySymbol={currencySymbol}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-2/3 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-5 w-1/3 rounded" />
        <Skeleton className="h-9 w-full rounded-lg mt-1" />
      </div>
    </div>
  );
}

export default ProductGrid;
