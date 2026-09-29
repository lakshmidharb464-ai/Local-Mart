import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useProductFilters } from '../hooks/useProductFilters';
import { useLocalLocation } from '../hooks/useLocalLocation';
import { ProductSearch } from '../components/product/ProductSearch';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { FilterDrawer } from '../components/product/FilterDrawer';
import { ProductSort } from '../components/product/ProductSort';
import { Breadcrumb } from '../components/navigation/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { ProductQuickViewModal } from '../components/product/ProductQuickViewModal';

/**
 * Public product discovery page (/products).
 * No authentication required.
 */
export default function ProductsPage() {
  const { products: allProducts, isLoading, loadError, refreshData } = useMarketplace();
  const { currencySymbol } = useAuth();
  const { location } = useLocalLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    products,
    resultCount,
  } = useProductFilters(allProducts);

  const filterProps = {
    selectedCategory,
    setSelectedCategory,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    resultCount,
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Products' },
  ];

  return (
    <>
      <SEOHead
        title="Fresh Local Produce — LocalFarm"
        description="Browse and buy fresh local produce, dairy, and farm boxes directly from nearby farms."
      />

      <div className="min-h-screen bg-farmBg">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <Breadcrumb items={breadcrumbs} className="mb-3" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-farmText font-display">
                  Fresh Local Produce
                </h1>
                {location && (
                  <p className="text-sm text-farmMuted mt-0.5">
                    Showing products near <strong>{location}</strong>
                  </p>
                )}
              </div>
              {/* Search bar */}
              <ProductSearch
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Desktop filter sidebar */}
            <div className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-24 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <ProductFilters {...filterProps} />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Sort bar + mobile filter trigger */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-farmText hover:border-farmGreen-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                  >
                    <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-farmGreen-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {!isLoading && (
                    <p className="text-sm text-farmMuted" aria-live="polite" aria-atomic="true">
                      {resultCount === 0
                        ? 'No products found'
                        : `${resultCount} product${resultCount !== 1 ? 's' : ''}`}
                    </p>
                  )}
                </div>

                <ProductSort value={sortBy} onChange={setSortBy} />
              </div>

              {/* Load Error Alert */}
              {loadError && (
                <div
                  role="alert"
                  className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
                >
                  <p>{loadError}</p>
                  {refreshData && (
                    <button
                      type="button"
                      onClick={refreshData}
                      className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-xs transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {/* Product grid */}
              <ProductGrid
                products={products}
                isLoading={isLoading}
                onQuickView={setQuickViewProduct}
                currencySymbol={currencySymbol}
                emptyTitle="No products found nearby"
                emptyMessage="Try changing your location or removing a filter."
              />
              {/* Clear filters action when no results */}
              {!isLoading && products.length === 0 && activeFilterCount > 0 && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-farmGreen-600 text-white text-sm font-semibold rounded-xl hover:bg-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterProps={filterProps}
      />

      {/* Quick view modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
