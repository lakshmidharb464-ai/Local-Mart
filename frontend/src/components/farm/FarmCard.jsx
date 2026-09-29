import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, Store, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { formatDistanceShort } from '../../utils/distance';

/**
 * Compact farm card for farm discovery strips and product sidebar.
 *
 * @param {object} props
 * @param {object} props.farmer - Farmer data object.
 * @param {string} [props.className]
 */
export function FarmCard({ farmer, className = '' }) {
  return (
    <Link
      to={`/farms/${farmer.id}`}
      className={`block bg-white rounded-xl border border-gray-100 hover:border-farmGreen-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 ${className}`}
      aria-label={`View farm profile for ${farmer.name}`}
    >
      <div className="flex items-center gap-3">
        {/* Farmer avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-farmGreen-100 shrink-0">
          {farmer.image ? (
            <img
              src={farmer.image}
              alt={farmer.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-farmGreen-700 font-bold text-lg">
              {farmer.name?.[0] || 'F'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-farmText truncate group-hover:text-farmGreen-700 transition-colors">
            {farmer.name}
          </p>
          <div className="flex items-center gap-1 text-farmMuted mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="text-xs truncate">{farmer.location}</span>
          </div>
          {farmer.specialty && (
            <p className="text-xs text-farmMuted truncate mt-0.5">{farmer.specialty}</p>
          )}
        </div>

        <ArrowRight className="w-4 h-4 text-farmMuted group-hover:text-farmGreen-600 group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
      </div>

      {/* Fulfillment indicators */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-farmMuted">
          <Truck className="w-3 h-3" aria-hidden="true" />
          Delivery
        </span>
        <span className="flex items-center gap-1 text-xs text-farmMuted">
          <Store className="w-3 h-3" aria-hidden="true" />
          Pickup
        </span>
        {farmer.productsCount !== undefined && (
          <span className="ml-auto text-xs font-semibold text-farmGreen-700">
            {farmer.productsCount} products
          </span>
        )}
      </div>
    </Link>
  );
}

export default FarmCard;
