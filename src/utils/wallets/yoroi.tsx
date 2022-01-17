import React from 'react';

import {
  DISCORD_SUPPORT_URL,
  TELEGRAM_SUPPORT_URL,
  YOROI_NIGHTLY_LINK,
} from '../../common/constants/env';
import { WalletContextType } from '../../context';
import { Typography } from '../../ergodex-cdk';
import { walletCookies } from '../cookies';

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void | Error> => {
    if (!window.ergo_request_read_access) {
      return Promise.reject(
        <>
          To use ErgoDEX install{' '}
          <Typography.Link href={YOROI_NIGHTLY_LINK} target="_blank">
            Yoroi Nightly
          </Typography.Link>{' '}
          .
        </>,
      );
    }

    return window.ergo_request_read_access().then((isConnected) => {
      if (isConnected) {
        ctx.setIsWalletConnected(isConnected);
        walletCookies.setConnected();
      } else {
        walletCookies.removeConnected();
        return Promise.reject(
          <>
            Seems like an issue on Yoroi side. Get help in{' '}
            <Typography.Link href={DISCORD_SUPPORT_URL} target="_blank">
              Discord
            </Typography.Link>{' '}
            or{' '}
            <Typography.Link href={TELEGRAM_SUPPORT_URL} target="_blank">
              Telegram
            </Typography.Link>
            .
          </>,
        );
      }
    });
  };
