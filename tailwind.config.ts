import type { Config } from 'tailwindcss';

const config: Config = {
  // IMPORTANT: Enable class-based dark mode here.
  // This tells Tailwind to apply 'dark:' prefixed styles only when
  // the 'dark' class is present on the <html> element or a parent.
  darkMode: 'class',
  content: [
    // IMPORTANT: For Tailwind CSS v4, this `content` array is crucial for scanning your files.
    // Ensure all paths where you use Tailwind classes are included.
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Add any other paths where you use Tailwind classes, e.g., if you have top-level components
    './src/*.{js,ts,jsx,tsx,mdx}', // Catches top-level files in src like layout.tsx, page.tsx if directly there
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here, e.g., custom colors, fonts
    },
  },
  // Plugins for Tailwind CSS v4 are typically added here if needed.
  plugins: [],
};
export default config;
