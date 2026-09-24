import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const withOpacity = (token: string) =>
  `rgba(var(--color-${token}), <alpha-value>)`

const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: withOpacity('accent'),
          foreground: withOpacity('accent-foreground'),
        },
        background: withOpacity('background'),
        base: {
          black: withOpacity('base-black'),
          white: withOpacity('base-white'),
        },
        gray: {
          25: withOpacity('gray-25'),
          50: withOpacity('gray-50'),
          100: withOpacity('gray-100'),
          200: withOpacity('gray-200'),
          300: withOpacity('gray-300'),
          400: withOpacity('gray-400'),
          500: withOpacity('gray-500'),
          600: withOpacity('gray-600'),
          700: withOpacity('gray-700'),
          800: withOpacity('gray-800'),
          900: withOpacity('gray-900'),
          950: withOpacity('gray-950'),
        },
        border: withOpacity('border'),
        card: {
          DEFAULT: withOpacity('card'),
          foreground: withOpacity('card-foreground'),
        },
        destructive: {
          DEFAULT: withOpacity('destructive'),
          foreground: withOpacity('destructive-foreground'),
        },
        foreground: withOpacity('foreground'),
        info: {
          DEFAULT: withOpacity('info'),
          foreground: withOpacity('info-foreground'),
        },
        input: withOpacity('input'),
        muted: {
          DEFAULT: withOpacity('muted'),
          foreground: withOpacity('muted-foreground'),
        },
        popover: {
          DEFAULT: withOpacity('popover'),
          foreground: withOpacity('popover-foreground'),
        },
        primary: {
          50: withOpacity('primary-50'),
          100: withOpacity('primary-100'),
          200: withOpacity('primary-200'),
          300: withOpacity('primary-300'),
          400: withOpacity('primary-400'),
          500: withOpacity('primary-500'),
          600: withOpacity('primary-600'),
          700: withOpacity('primary-700'),
          800: withOpacity('primary-800'),
          900: withOpacity('primary-900'),
          950: withOpacity('primary-950'),
          DEFAULT: withOpacity('primary'),
          foreground: withOpacity('primary-foreground'),
          hover: withOpacity('primary-hover'),
          subtle: withOpacity('primary-subtle'),
        },
        secondary: {
          50: withOpacity('secondary-50'),
          100: withOpacity('secondary-100'),
          200: withOpacity('secondary-200'),
          300: withOpacity('secondary-300'),
          400: withOpacity('secondary-400'),
          500: withOpacity('secondary-500'),
          600: withOpacity('secondary-600'),
          700: withOpacity('secondary-700'),
          800: withOpacity('secondary-800'),
          900: withOpacity('secondary-900'),
          950: withOpacity('secondary-950'),
        },
        ring: withOpacity('ring'),
        success: {
          DEFAULT: withOpacity('success'),
          foreground: withOpacity('success-foreground'),
        },
        surface: {
          DEFAULT: withOpacity('surface'),
          elevated: withOpacity('surface-elevated'),
          muted: withOpacity('surface-muted'),
        },
        warning: {
          DEFAULT: withOpacity('warning'),
          foreground: withOpacity('warning-foreground'),
        },
      },
      fontFamily: {
        sans: ['IRANSansX FaNum', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default preset
