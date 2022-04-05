import Cookies from 'js-cookie';

import { MESSAGE_COOKIE } from './common';

export const onDisconnect = (): void => Cookies.remove(MESSAGE_COOKIE);
