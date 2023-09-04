import '@ergolabs/ui-kit/dist/styles/fonts/fonts.less';
import './assets/styles/styles.less';

import { StrictMode } from 'react';
import { isIOS, isMobile, osVersion } from 'react-device-detect';
import * as ReactDOM from 'react-dom';

import { ApplicationInitializer } from './App';
import { IOSNotSupportedScreen } from './components/IOSNotSupportedScreen/IOSNotSupportedScreen';
import { SettingsProvider } from './context';

// TODO: FIX
if ('serviceWorker' in navigator) {
  try {
    navigator?.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations) {
        registrations.forEach((r) => {
          r.update();
          console.log(r, 'updates');
        });
      }
    });
    caches.keys().then((keys) =>
      keys.forEach((key) => {
        caches.delete(key);
        console.log('cache deleted', key);
      }),
    );
  } catch (e) {
    console.warn('no sws');
  }
}

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
