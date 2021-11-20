const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule: (lessRule) => {
          lessRule.use = lessRule.use.map((item) => {
            return !(item.loader || '').includes('resolve-url-loader')
              ? item
              : {
                  ...item,
                  options: { ...item.options, root: path.resolve(__dirname) },
                };
          });
          return lessRule;
        },
      },
    },
  ],
};
