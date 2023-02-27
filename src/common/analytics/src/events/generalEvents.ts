import {
  ElementLocationProps,
  LocaleProps,
  NetworkProps,
  ThemeProps,
  TokenProps,
  WebVitalsProps,
} from './generalProps';

export type GeneralEvents = {
  'Page Viewed': undefined;
  'App Launch': undefined;

  'Web Vitals': WebVitalsProps;

  'Cookies Accepted': undefined;
  'Cookies Rejected': undefined;

  'Select Network': NetworkProps;

  'Select Theme': ThemeProps;
  'Select Locale': LocaleProps;

  'Open Select Token Modal': ElementLocationProps;
  'Select Token': TokenProps & ElementLocationProps;

  'Click MAX Button': TokenProps & ElementLocationProps;
};
