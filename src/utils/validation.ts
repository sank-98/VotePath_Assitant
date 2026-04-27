/**
 * UTILITIES: Sanitization & Deep Validation
 */

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim(); // Basic XSS prevention
};

export const validatePostalCode = (code: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(code); // Indian Pincode format
};

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
