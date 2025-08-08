// Utility function to calculate luminance of a color
export const getLuminance = (hex: string): number => {
  // Remove # if present
  const color = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(color.substr(0, 2), 16) / 255;
  const g = parseInt(color.substr(2, 2), 16) / 255;
  const b = parseInt(color.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Get the best contrasting text color (white or black) for a given background color
export const getContrastingTextColor = (backgroundColor: string): string => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  // Return white if it has better contrast, otherwise black
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

// Get a semi-transparent version of the contrasting color for secondary text
export const getContrastingSecondaryColor = (backgroundColor: string): string => {
  const primaryColor = getContrastingTextColor(backgroundColor);
  return primaryColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
};