import { i18nConfig } from '@shared/i18n/config'
import common from '@shared/i18n/locales/fa/common.json'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

const resources = {
  fa: { common },
}

document.documentElement.dir = 'rtl'
document.documentElement.lang = i18nConfig.defaultLanguage

export const i18nReady = i18n.use(initReactI18next).init({
  defaultNS: i18nConfig.defaultNamespace,
  fallbackLng: i18nConfig.defaultLanguage,
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: i18nConfig.defaultLanguage,
  ns: i18nConfig.namespaces,
  resources,
  supportedLngs: i18nConfig.supportedLanguages,
})

type Namespace = (typeof i18nConfig.namespaces)[number]

export function useTranslate(
  namespace: Namespace | readonly Namespace[] = i18nConfig.defaultNamespace
) {
  return useTranslation(namespace)
}

export { i18n }
