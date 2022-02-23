import Cookies from 'js-cookie';

import { ArgsProps } from '../../../../ergodex-cdk';
import { MESSAGE_COOKIE } from './common';

export const getNotification = (): ArgsProps | undefined => {
  if (Cookies.get(MESSAGE_COOKIE)) {
    return undefined;
  }
  Cookies.set(MESSAGE_COOKIE, 'true', { expires: 1 });
  return {
    message: 'Yoroi Wallet tip',
    description:
      'Keep Yoroi Wallet extension window open, when you use ErgoDEX. So that it will sync faster.',
  };
};
