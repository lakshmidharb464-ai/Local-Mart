/**
 * Format a distance in kilometres to a human-readable string.
 * @param {number} km - Distance in kilometres.
 * @returns {string} e.g. "2.4 km away" or "< 1 km away"
 */
export function formatDistance(km) {
  if (typeof km !== 'number' || isNaN(km)) return 'Distance unknown';
  if (km < 1) return '< 1 km away';
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

/**
 * Returns a short distance label for badges/chips.
 * @param {number} km
 * @returns {string} e.g. "2.4 km"
 */
export function formatDistanceShort(km) {
  if (typeof km !== 'number' || isNaN(km)) return '—';
  if (km < 1) return '< 1 km';
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
