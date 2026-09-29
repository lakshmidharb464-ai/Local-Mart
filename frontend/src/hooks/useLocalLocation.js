import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'localfarm_location';

/**
 * Manages the user's selected local area/location.
 * Persisted to localStorage so it survives page reload.
 *
 * @returns {object}
 *   - location {string} - The selected location label, e.g. "Pune"
 *   - setLocation {function} - Update and persist location
 *   - clearLocation {function} - Remove saved location
 *   - isSet {boolean} - Whether a location has been chosen
 */
export function useLocalLocation() {
  const [location, setLocationState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const setLocation = useCallback((newLocation) => {
    setLocationState(newLocation);
    try {
      if (newLocation) {
        localStorage.setItem(STORAGE_KEY, newLocation);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable — continue without persistence
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation('');
  }, [setLocation]);

  return {
    location,
    setLocation,
    clearLocation,
    isSet: Boolean(location),
  };
}

export default useLocalLocation;
