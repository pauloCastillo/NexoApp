/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#E8612C',
        primaryLight: '#F48B4A',
        primaryBg: '#FFF0E8',
        primaryDark: '#C94D1F',
        text: '#1A1A2E',
        textSecondary: '#6B7280',
        textLight: '#9CA3AF',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        disabled: '#D1D5DB',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
};
