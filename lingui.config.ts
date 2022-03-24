export default {
  catalogs: [
    {
      path: '<rootDir>/src/i18n/locales/{locale}',
      include: ['<rootDir>/src'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {
    default: 'en-US',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: [
    'ar-SA',
    'fr-FR',
    'en-US',
    'de-DE',
    'zh-CN',
    'zh-TW',
    'id-ID',
    'ja-JP',
    'pt-PT',
    'es-ES',
    'pseudo',
  ],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: 'pseudo',
};
