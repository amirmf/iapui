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
        brand: {
          50: withOpacity('brand-50'),
          100: withOpacity('brand-100'),
          200: withOpacity('brand-200'),
          300: withOpacity('brand-300'),
          400: withOpacity('brand-400'),
          500: withOpacity('brand-500'),
          600: withOpacity('brand-600'),
          700: withOpacity('brand-700'),
          800: withOpacity('brand-800'),
          900: withOpacity('brand-900'),
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
          DEFAULT: withOpacity('primary'),
          foreground: withOpacity('primary-foreground'),
          hover: withOpacity('primary-hover'),
          subtle: withOpacity('primary-subtle'),
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
