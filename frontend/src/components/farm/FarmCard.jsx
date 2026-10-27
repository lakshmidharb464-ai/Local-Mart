import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Sprout, ArrowRight, Package } from 'lucide-react';

/**
 * Compact Farm Discovery Card — Clean, Icon-Driven, Real Database Fields
 *
 * @param {object} props
 * @param {object} props.farmer - Authentic farmer data from database.
 * @param {string} [props.className]
 */
export function FarmCard({ farmer, className = '' }) {
  if (!farmer) return null;

  const farmName = farmer.farm_name || farmer.farmName || farmer.name || 'Local Farm';
  const farmerName = farmer.name || farmer.farmer_name || '';
  const location = farmer.location_address || farmer.location || farmer.district || 'Local';
  const rating = Number(farmer.rating || 5.0).toFixed(1);
  const isOrganic = Boolean(farmer.organic_certified || farmer.is_organic || farmer.organicCertified);
  const productsCount = farmer.productsCount ?? farmer.products_count ?? (Array.isArray(farmer.products) ? farmer.products.length : null);
  const experienceYears = farmer.experience_years || farmer.experienceYears;
  const avatar = farmer.avatar_url || farmer.image || farmer.avatar;

  return (
    <Link
      to={`/farms/${farmer.id || farmer.user_id}`}
      className={`block bg-white rounded-2xl border border-gray-100/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 p-4 group font-display select-none ${className}`}
      aria-label={`View farm profile for ${farmName}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Farm Photo / Avatar with Organic Badge */}
        <div className="relative w-13 h-13 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={farmName}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-800 font-black text-xl bg-gradient-to-br from-emerald-100 to-farmGreen-100">
              {farmName[0] || 'F'}
            </div>
          )}
          {isOrganic && (
            <div className="absolute bottom-0 inset-x-0 bg-emerald-700/90 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-tighter">
              Organic
            </div>
          )}
        </div>

        {/* Core Farm Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-sm font-black text-farmText truncate group-hover:text-emerald-700 transition-colors leading-tight">
              {farmName}
            </h3>
            {/* Real DB Rating Pill */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 shrink-0">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span className="text-[11px] font-black text-amber-900 font-mono">{rating}</span>
            </div>
          </div>

          {farmerName && farmerName !== farmName && (
            <p className="text-[11px] font-semibold text-farmMuted truncate mt-0.5">
              by {farmerName}
            </p>
          )}

          {/* Location Pin */}
          <div className="flex items-center gap-1 text-farmMuted text-xs font-medium mt-1 truncate">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Metric Chips Row — Minimal Text, High-Impact Visuals */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-100/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isOrganic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              Certified
            </span>
          )}

          {experienceYears && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 text-[10px] font-bold border border-gray-200">
              <Sprout className="w-3 h-3 text-emerald-600 shrink-0" />
              {experienceYears}y exp
            </span>
          )}

          {productsCount !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/60 text-emerald-900 text-[10px] font-bold border border-emerald-100">
              <Package className="w-3 h-3 text-emerald-600 shrink-0" />
              {productsCount} crops
            </span>
          )}
        </div>

        <div className="w-6 h-6 rounded-full bg-gray-50 group-hover:bg-emerald-600 flex items-center justify-center transition-colors shrink-0">
          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default FarmCard;
