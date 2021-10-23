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
        modifyLessRule: (lessRule, context) => {
          lessRule.use = lessRule.use.map(item => {
            return !(item.loader || '').includes('resolve-url-loader') ?
              item :
              ({
                ...item,
                options: {...item.options, root: path.resolve(__dirname),},
              })
          });
          // console.dir(JSON.stringify(lessRule, null, 2));
          // console.dir(JSON.stringify(newLoaders, null, 2));
          return lessRule;
        },
      },
    },
  ],
};
