import sharedPreset from '@iap/tailwind-config/preset'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/auth/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/forms/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/panel-switcher/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/files/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/support/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/theme/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedPreset],
}

export default config
