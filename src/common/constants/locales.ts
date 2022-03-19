export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  'en-US',
  'id-ID',
  'ar-SA',
  'fr-FR',
  'de-DE',
  'es-ES',
  'ja-JP',
  'pt-PT',
  'zh-CN',
  'zh-TW',
];

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

// export { messages as DEFAULT_MESSAGES } from '../../i18n/locales/en-US';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'ar-SA': 'العربية',
  'de-DE': 'Deutsch',
  'fr-FR': 'Français',
  'ja-JP': '日本語',
  'pt-PT': 'português',
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
  // 'af-ZA': 'Afrikaans',
  // 'ca-ES': 'Català',
  // 'cs-CZ': 'čeština',
  // 'da-DK': 'dansk',
  // 'el-GR': 'ελληνικά',
  // 'en-US': 'English',
  // 'es-ES': 'Español',
  // 'fi-FI': 'Suomalainen',
  // 'he-IL': 'עִברִית',
  // 'hu-HU': 'Magyar',
  // 'id-ID': 'bahasa Indonesia',
  // 'it-IT': 'Italiano',
  // 'ko-KR': '한국어',
  // 'nl-NL': 'Nederlands',
  // 'no-NO': 'norsk',
  // 'pl-PL': 'Polskie',
  // 'pt-BR': 'português',
  // 'ro-RO': 'Română',
  // 'ru-RU': 'Русский',
  // 'sr-SP': 'Српски',
  // 'sv-SE': 'svenska',
  // 'sw-TZ': 'Kiswahili',
  // 'tr-TR': 'Türkçe',
  // 'uk-UA': 'Український',
  // 'vi-VN': 'Tiếng Việt',
};
