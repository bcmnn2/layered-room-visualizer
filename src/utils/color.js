export const parseHex = (input) => {
  if (!input) return null;
  let hex = input.replace(/\s+/g, ''); // Remove spaces
  if (!hex.startsWith('#')) hex = '#' + hex; // Add # if missing
  
  // Support both 3 and 6 digit hex codes
  const regex = /^#([A-Fa-f0-9]{3}){1,2}$/;
  return regex.test(hex) ? hex : null;
};
