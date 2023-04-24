export default {
  catalogs: [
    {
      path: '<rootDir>/src/i18n/locales/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/*.d.ts'],
    },
  ],
  compileNamespace: 'es',
  fallbackLocales: {
    default: 'en-US',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: [
    'en-US',
    'fr-FR',
    'de-DE',
    'id-ID',
    'es-ES',
    'pt-PT',
    'pt-BR',
    'ar-SA',
    'ja-JP',
    'zh-CN',
    'zh-TW',
    'pseudo',
  ],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: 'pseudo',
};
