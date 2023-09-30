import { testText$ } from '../../../common/streams/appTick';

export const initializeDAppBridge = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
      testText$.next(window.dAppConnectorBridge?.name || 'no');
    }, 100);
  });
};
