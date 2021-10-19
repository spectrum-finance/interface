import './styles.less';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: { disable: true },
  themes: [
    { name: 'Light Theme', class: 'light', color: '#e5e5e5', default: true },
    { name: 'Dark Theme', class: 'dark', color: '#000000' }
  ],
}
