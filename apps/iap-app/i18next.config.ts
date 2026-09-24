const i18nextConfig = {
  locales: ['fa'],
  extract: {
    defaultNS: 'common',
    input: 'src/**/*.{js,jsx,ts,tsx}',
    output: 'src/shared/i18n/locales/{{language}}/{{namespace}}.json',
  },
}

export default i18nextConfig
