const CracoLessPlugin = require('craco-less');
const {
  gray1,
  gray2,
  gray3,
  gray5,
  gray6,
  gray7,
  gray9,
  gray10,
  orange5,
  orange6,
  dustRed6,
} = require('./src/constants/colors');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,

      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              /*
               * To redefine default ant-design colors use the following url:
               * https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
               * */

              // --Colors--

              // >> Primary
              // --
              '@primary-color': orange5,
              '@primary-color-hover': orange6,
              '@primary-color-active': orange6,

              // >> Disable
              // --
              '@disabled-color': gray3,

              // --Components--

              // Button
              // --
              '@btn-primary-color': gray10,
              '@btn-primary-bg': orange5,
              '@btn-default-color': gray9,
              '@btn-default-bg': gray1,
              '@btn-default-border': gray5,
              '@btn-danger-bg': dustRed6,
              '@btn-text-hover-bg': gray2,
              '@btn-disable-color': gray6,
              '@btn-disable-bg': gray3,
              '@btn-disable-border': 'transparent',
              '@btn-default-ghost-bg': gray1,

              // Icon
              // --
              '@icon-color': 'currentColor',

              // Dropdown
              // --
              '@dropdown-menu-bg': gray3,
              '@dropdown-menu-item-color': gray9,

              // Menu
              // --
              '@menu-bg': gray1,
              '@menu-popup-bg': gray1,
              '@menu-item-color': gray9,
              '@menu-inline-submenu-bg': gray1,
              '@menu-item-active-bg': gray3,
              '@menu-item-active-danger-bg': dustRed6,
              '@menu-item-group-title-color': gray9,

              // Modal
              // --
              '@modal-header-bg': gray1,
              '@modal-content-bg': gray1,
              '@modal-footer-bg': gray1,
              '@modal-header-border-color-split': gray1,
              '@modal-footer-border-color-split': gray1,
              '@modal-footer-border-style': gray2,
              '@modal-heading-color': gray9,
              '@modal-close-color': gray9,

              // Input
              // --
              '@input-height-base': '32px',
              '@input-height-lg': '40px',
              '@input-height-sm': '24px',
              '@input-placeholder-color': gray7,
              '@input-color': gray9,
              '@input-icon-color': gray7,
              '@input-border-color': gray5,
              '@input-bg': gray1,
              '@input-hover-border-color': gray9,
              '@input-disabled-bg': gray3,
              '@input-disabled-color': gray6,

              // Form
              // ---
              '@label-color': gray9,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
