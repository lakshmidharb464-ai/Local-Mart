import React from 'react';
import { MapPin, Truck, Store, Leaf } from 'lucide-react';
import { formatDistanceShort } from '../../utils/distance';

/**
 * Farm profile page header — clean, trustworthy, no fabricated claims.
 *
 * @param {object} props
 * @param {object} props.farmer - Full farmer data object.
 */
export function FarmHeader({ farmer }) {
  return (
    <section className="bg-white border-b border-gray-100" aria-label="Farm information">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-farmGreen-100 shrink-0 border-2 border-farmGreen-100">
            {farmer.image ? (
              <img
                src={farmer.image}
                alt={`${farmer.name} — farm profile photo`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-farmGreen-700 font-bold text-3xl">
                {farmer.name?.[0] || 'F'}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-farmText font-display">
              {farmer.name}
            </h1>

            {/* Location + distance */}
            <div className="flex items-center gap-1.5 text-farmMuted mt-1">
              <MapPin className="w-4 h-4 shrink-0 text-farmGreen-600" aria-hidden="true" />
              <span className="text-sm">{farmer.location}</span>
            </div>

            {/* Experience + Specialty */}
            {(farmer.experience || farmer.specialty) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {farmer.experience && (
                  <span className="text-sm text-farmMuted">{farmer.experience}</span>
                )}
                {farmer.specialty && (
                  <span className="text-sm font-medium text-farmGreen-700 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                    {farmer.specialty}
                  </span>
                )}
              </div>
            )}

            {/* Fulfillment */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-farmGreen-50 border border-farmGreen-100 rounded-lg text-xs font-semibold text-farmGreen-800">
                <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                Delivery available
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-blue-800">
                <Store className="w-3.5 h-3.5" aria-hidden="true" />
                Farm pickup available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmHeader;
