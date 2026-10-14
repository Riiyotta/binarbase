/** @type {import('tailwindcss').Config} */
// Preflight is off: the original reset (entry.qOVbJ9mW.css, ported in src/styles/site.css) must win.
// Colors mirror the :root tokens in site.css (CLONE_SPEC 1.2) for any Tailwind utilities added later.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6042f9', dark: '#4d35c7' },
        'gradient-start': '#3f34fe',
        'gradient-end': '#8e64fa',
        text: { DEFAULT: '#0a2540', secondary: '#425466', tertiary: '#697386' },
        bg: { DEFAULT: '#fff', secondary: '#f6f9fc', tertiary: '#f0f3f7' },
        border: '#e6ebf1',
        success: '#00d4aa',
        warning: '#fb0',
        // Intro-only tokens (.sbi)
        ink: '#070c1f',
        paper: '#f4f2ff',
        muted: '#bdb9de',
        lav: '#c4b8ff',
        violet: '#6042f9',
        // Deployment-only tokens
        'dp-in': '#00a67d',
        'dp-out': '#6042f9',
        'dp-opt': '#d68a00',
      },
    },
  },
  plugins: [],
}
