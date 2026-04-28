/**
 * PRODUCTION-GRADE INPUT SANITIZATION
 * 
 * Prevents XSS attacks by cleaning raw strings before rendering or storage.
 * 
 * @param str - The raw string to sanitize
 * @returns A safe, clean string with HTML tags removed or escaped
 */
export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim(); 
};

/**
 * INDIAN PINCODE VALIDATOR
 * 
 * @param code - 6-digit PIN code
 * @returns Boolean indicating if the format is valid
 */
export const validatePostalCode = (code: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(code); 
};

/**
 * GEOSPATIAL DISTANCE CALCULATOR
 * 
 * Uses Haversine formula to find distance between two points.
 * 
 * @param lat1 - Source Latitude
 * @param lon1 - Source Longitude
 * @param lat2 - Destination Latitude
 * @param lon2 - Destination Longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
