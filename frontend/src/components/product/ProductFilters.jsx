import React from 'react';
import { CATEGORIES } from '../../constants/categories';
import { Checkbox } from '../ui/Checkbox';

const DISTANCE_OPTIONS = [
  { value: 2,   label: '≤ 2 km' },
  { value: 5,   label: '≤ 5 km' },
  { value: 10,  label: '≤ 10 km' },
  { value: null, label: 'Any distance' },
];

/**
 * Desktop sidebar filter panel for product discovery.
 *
 * @param {object} props
 * @param {string} props.selectedCategory
 * @param {function} props.setSelectedCategory
 * @param {object} props.filters - { inStockOnly, delivery, pickup, maxDistanceKm, maxPrice }
 * @param {function} props.updateFilter - (key, value) => void
 * @param {function} props.clearFilters
 * @param {number} props.activeFilterCount
 * @param {string} [props.className]
 */
export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  filters,
  updateFilter,
  clearFilters,
  activeFilterCount,
  className = '',
}) {
  return (
    <aside
      className={`flex flex-col gap-6 ${className}`}
      aria-label="Product filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-farmText">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-farmGreen-700 hover:text-farmGreen-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category */}
      <fieldset>
        <legend className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-3">Category</legend>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500
                ${selectedCategory === cat.id
                  ? 'bg-farmGreen-600 text-white font-semibold'
                  : 'text-farmText hover:bg-farmGreen-50 hover:text-farmGreen-700'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* Availability */}
      <fieldset>
        <legend className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-3">Availability</legend>
        <Checkbox
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={e => updateFilter('inStockOnly', e.target.checked)}
          id="filter-in-stock"
        />
      </fieldset>

      <hr className="border-gray-100" />

      {/* Distance */}
      <fieldset>
        <legend className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-3">Distance</legend>
        <div className="flex flex-col gap-1.5">
          {DISTANCE_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => updateFilter('maxDistanceKm', opt.value)}
              aria-pressed={filters.maxDistanceKm === opt.value}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500
                ${filters.maxDistanceKm === opt.value
                  ? 'bg-farmGreen-600 text-white font-semibold'
                  : 'text-farmText hover:bg-farmGreen-50 hover:text-farmGreen-700'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <hr className="border-gray-100" />

      {/* Fulfillment */}
      <fieldset>
        <legend className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-3">Fulfillment</legend>
        <div className="flex flex-col gap-2">
          <Checkbox
            label="Delivery"
            checked={filters.delivery}
            onChange={e => updateFilter('delivery', e.target.checked)}
            id="filter-delivery"
          />
          <Checkbox
            label="Pickup"
            checked={filters.pickup}
            onChange={e => updateFilter('pickup', e.target.checked)}
            id="filter-pickup"
          />
        </div>
      </fieldset>
    </aside>
  );
}

export default ProductFilters;
