// Solo Leveling inspired color palette
export const colors = {
  // Primary dark theme
  background: {
    primary: '#0A0E1A',      // Deep dark blue-black
    secondary: '#12161F',     // Slightly lighter dark
    tertiary: '#1A1F2E',      // Card backgrounds
    elevated: '#252B3D',      // Elevated cards/modals
  },

  // Accent colors (inspired by Solo Leveling's blue/purple glow)
  primary: {
    main: '#4C6FFF',          // Bright blue
    light: '#6B8AFF',         // Light blue
    dark: '#3D5AE6',          // Dark blue
    glow: '#7F9FFF',          // Glow effect
  },

  // Secondary accent (purple for special effects)
  secondary: {
    main: '#8B5CF6',          // Purple
    light: '#A78BFA',         // Light purple
    dark: '#7C3AED',          // Dark purple
    glow: '#C4B5FD',          // Purple glow
  },

  // Rank colors
  rank: {
    E: '#8B8B8B',             // Gray
    D: '#4ADE80',             // Green
    C: '#60A5FA',             // Blue
    B: '#A78BFA',             // Purple
    A: '#FBBF24',             // Gold
    S: '#F87171',             // Red/Crimson
  },

  // Status colors
  status: {
    success: '#10B981',       // Green
    warning: '#F59E0B',       // Orange
    error: '#EF4444',         // Red
    info: '#3B82F6',          // Blue
  },

  // Text colors
  text: {
    primary: '#F9FAFB',       // Almost white
    secondary: '#D1D5DB',     // Light gray
    tertiary: '#9CA3AF',      // Medium gray
    disabled: '#6B7280',      // Dark gray
    inverse: '#0A0E1A',       // Dark (for light backgrounds)
  },

  // UI elements
  border: {
    primary: '#374151',       // Default border
    secondary: '#4B5563',     // Lighter border
    focus: '#4C6FFF',         // Focused border (primary blue)
  },

  // Special effects
  effects: {
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(10, 14, 26, 0.8)',
    glow: 'rgba(76, 111, 255, 0.3)',
    shimmer: 'rgba(255, 255, 255, 0.1)',
  },

  // XP and progress
  xp: {
    bar: '#4C6FFF',           // XP bar color
    background: '#252B3D',    // XP bar background
    text: '#A78BFA',          // XP text color
  },
};

export type Colors = typeof colors;
