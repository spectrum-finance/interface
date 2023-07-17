import '@ergolabs/ui-kit/dist/styles/fonts/fonts.less';
import './assets/styles/styles.less';

import { isIOS, isMobile, osVersion } from 'react-device-detect';
import { createRoot } from 'react-dom/client';

import { ApplicationInitializer } from './App';
import { IOSNotSupportedScreen } from './components/IOSNotSupportedScreen/IOSNotSupportedScreen';
import { SettingsProvider } from './context';

const init = () => {
  const container = document.getElementById('app');
  const root = createRoot(container!);

  if (
    isIOS &&
    osVersion <= '14' &&
    isMobile &&
    navigator.platform.indexOf('Mac') === -1
  ) {
    root.render(<IOSNotSupportedScreen />);
    return;
  }

  root.render(
    <SettingsProvider>
      <ApplicationInitializer />
    </SettingsProvider>,
  );
};

init();
