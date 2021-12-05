import React from 'react';

import {
  DISCORD_SUPPORT_URL,
  TELEGRAM_SUPPORT_URL,
  YOROI_DAPP_CONNECTOR_LINK,
  YOROI_NIGHTLY_LINK,
} from '../../constants/env';
import { WalletContextType } from '../../context';
import { Typography } from '../../ergodex-cdk';
import { walletCookies } from '../cookies';
import { isBrave } from '../userAgent';

export const connectYoroiWallet =
  (ctx: WalletContextType) => (): Promise<void | Error> => {
    if (isBrave()) {
      walletCookies.removeConnected();
      return Promise.reject(
        "Yoroi Nightly extension doesn't support Brave browser yet. Use Google Chrome instead, please.",
      );
    }

    if (!window.ergo_request_read_access) {
      return Promise.reject(
        <>
          To use ErgoDEX install{' '}
          <Typography.Link href={YOROI_NIGHTLY_LINK} target="_blank">
            Yoroi Nightly
          </Typography.Link>{' '}
          and{' '}
          <Typography.Link href={YOROI_DAPP_CONNECTOR_LINK} target="_blank">
            Yoroi dAppConnector
          </Typography.Link>
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
