const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,

      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#FF5135',
              '@primary-color-hover': '#FF725C',
              '@primary-color-active': '#FF725C',

              '@disabled-color': '#262626',

              '@btn-primary-color': '#fff',
              '@btn-primary-bg': '#FF5135',

              '@btn-default-color': '#DBDBDB',
              '@btn-default-bg': '#141414',
              '@btn-default-border': '#434343',

              '@btn-danger-bg': '#D32029',

              '@btn-text-hover-bg': '#1D1D1D',

              '@btn-disable-color': '#5A5A5A',
              '@btn-disable-bg': '#262626',
              '@btn-disable-border': 'transparent',

              '@btn-default-ghost-bg': '#141414',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
