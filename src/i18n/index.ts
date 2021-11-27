import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    backend: {
      loadPath: '/i18n/{{lng}}{{ns}}.json',
    },
    ns: [''],
    defaultNS: '',
    fallbackLng: 'en',
    debug: true,
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });
