import React from 'react';
import { MapPin, Star, ShieldCheck, Sprout, Sparkles, Truck, Store, Award } from 'lucide-react';

/**
 * Farm Profile Page Header — Clean, Authentic Database Fields, Minimal Text & Modern Chips
 *
 * @param {object} props
 * @param {object} props.farmer - Authentic farmer data from database.
 */
export function FarmHeader({ farmer }) {
  if (!farmer) return null;

  const farmName = farmer.farm_name || farmer.farmName || farmer.name || 'Local Farm';
  const farmerName = farmer.name || farmer.farmer_name || '';
  const location = [farmer.location_address || farmer.location, farmer.district, farmer.state].filter(Boolean).join(', ') || 'Local Regional Farm';
  const rating = Number(farmer.rating || 5.0).toFixed(1);
  const isOrganic = Boolean(farmer.organic_certified || farmer.is_organic || farmer.organicCertified);
  const badge = farmer.badge || (isOrganic ? 'Certified Organic Grower' : 'Local Farm Direct');
  const experienceYears = farmer.experience_years || farmer.experienceYears;
  const specialty = farmer.specialty;
  const avatar = farmer.avatar_url || farmer.image || farmer.avatar;

  return (
    <section className="bg-white border-b border-gray-100 font-display select-none" aria-label="Farm Information">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          
          {/* Farm Avatar / Logo with Organic Stamp */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-emerald-50 border-2 border-emerald-200/80 shrink-0 shadow-sm">
            {avatar ? (
              <img
                src={avatar}
                alt={`${farmName} farm photo`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-800 font-black text-3xl bg-gradient-to-br from-emerald-100 to-farmGreen-100">
                {farmName[0] || 'F'}
              </div>
            )}
            {isOrganic && (
              <div className="absolute bottom-0 inset-x-0 bg-emerald-700/95 text-white text-[9px] font-black uppercase text-center py-0.5 tracking-tight flex items-center justify-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                Organic
              </div>
            )}
          </div>

          {/* Farm Title & Verification Row */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-farmText leading-tight">
                {farmName}
              </h1>

              {/* Verified Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {badge}
              </span>

              {/* Rating Pill */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black font-mono shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{rating}</span>
              </div>
            </div>

            {farmerName && farmerName !== farmName && (
              <p className="text-xs text-farmMuted font-semibold mt-1">
                Managed by <strong className="text-farmText">{farmerName}</strong>
              </p>
            )}

            {/* Location */}
            <div className="flex items-center gap-1.5 text-farmMuted text-xs font-medium mt-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{location}</span>
            </div>

            {/* Metric Chips (Experience, Specialty, Delivery, Pickup) */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {experienceYears && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  {experienceYears} Years Farming
                </span>
              )}

              {specialty && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {specialty}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-xl text-xs font-bold text-cyan-900">
                <Truck className="w-3.5 h-3.5 text-cyan-600" />
                Direct Delivery
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-xs font-bold text-purple-900">
                <Store className="w-3.5 h-3.5 text-purple-600" />
                Farm Gate Pickup
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FarmHeader;
