import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

/**
 * Encapsulates all product filter, sort, and search logic.
 * Keeps this state out of page-level components.
 *
 * @param {Array} products - Full product list from MarketplaceContext.
 * @returns {object} Filtered/sorted products + state handlers.
 */
export function useProductFilters(products = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    inStockOnly: false,
    delivery: false,
    pickup: false,
    maxDistanceKm: null,  // null = no filter
    maxPrice: null,       // null = no filter
  });

  // Sync state if URL query params change
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null && s !== searchQuery) {
      setSearchQuery(s);
    }
    const c = searchParams.get('category');
    if (c !== null && c !== selectedCategory) {
      setSelectedCategory(c);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('relevance');
    setFilters({ inStockOnly: false, delivery: false, pickup: false, maxDistanceKm: null, maxPrice: null });
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Text search: name, category, farmer name
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q) ||
        p.farmerLocation?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // In-stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Distance filter
    if (filters.maxDistanceKm !== null && filters.maxDistanceKm > 0) {
      result = result.filter(p =>
        typeof p.distanceKm === 'number' && p.distanceKm <= filters.maxDistanceKm
      );
    }

    // Price filter
    if (filters.maxPrice !== null && filters.maxPrice > 0) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    // Availability (status) — only show Approved products to buyers
    result = result.filter(p => !p.status || p.status === 'Approved');

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'distance':
        result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
        break;
      case 'newest':
        // In lieu of real timestamps, keep original order (most recently added first)
        break;
      case 'relevance':
      default:
        // Relevance: in-stock first, then by distance
        result.sort((a, b) => {
          if ((b.stock > 0) !== (a.stock > 0)) return (b.stock > 0) ? 1 : -1;
          return (a.distanceKm || 999) - (b.distanceKm || 999);
        });
        break;
    }

    return result;
  }, [products, debouncedSearch, selectedCategory, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (filters.inStockOnly) count++;
    if (filters.delivery) count++;
    if (filters.pickup) count++;
    if (filters.maxDistanceKm !== null) count++;
    if (filters.maxPrice !== null) count++;
    return count;
  }, [selectedCategory, filters]);

  return {
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
    products: filteredAndSorted,
    resultCount: filteredAndSorted.length,
  };
}

export default useProductFilters;
