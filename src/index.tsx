import '@ergolabs/ui-kit/dist/styles/fonts/fonts.less';
import './assets/styles/styles.less';

import { StrictMode } from 'react';
import { isIOS, isMobile, osVersion } from 'react-device-detect';
import * as ReactDOM from 'react-dom';

import { ApplicationInitializer } from './App';
import { testText$ } from './common/streams/appTick';
import { IOSNotSupportedScreen } from './components/IOSNotSupportedScreen/IOSNotSupportedScreen';
import { SettingsProvider } from './context';

const init = () => {
  const container = document.getElementById('app');

  if (
    isIOS &&
    osVersion <= '14' &&
    isMobile &&
    navigator.platform.indexOf('Mac') === -1
  ) {
    ReactDOM.render(<IOSNotSupportedScreen />, container);
    return;
  }

  ReactDOM.render(
    <StrictMode>
      <SettingsProvider>
        <ApplicationInitializer />
      </SettingsProvider>
    </StrictMode>,
    container,
  );
};

init();

if (window.initCardanoDAppConnectorBridge) {
  window.initCardanoDAppConnectorBridge(async (walletApi) => {
    console.log('here');
    testText$.next(walletApi.name || 'no');
  });
}
