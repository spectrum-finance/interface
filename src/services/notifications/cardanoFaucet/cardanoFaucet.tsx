import './cardanoFaucet.less';

import { t } from '@lingui/macro';
import React from 'react';

import { useSubject } from '../../../common/hooks/useObservable';
import { Button, Flex, notification, Typography } from '../../../ergodex-cdk';
import { getTestnetTokens } from '../../../network/cardano/api/faucet/faucet';

const NOTIFICATION_KEY = 'faucet-notification';

const GetTokensButton = () => {
  const [, getTokens, isLoading, err] = useSubject(getTestnetTokens, []);

  return (
    <Button type="primary" onClick={getTokens} loading={isLoading}>
      Get testnet tokens
    </Button>
  );
};

export const openCardanoFaucetNotification = (): void => {
  const message = (
    <>
      <Flex col>
        <Flex.Item>
          <Typography.Title level={4}>
            {t`Get your testnet tokens`}
          </Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body>
            {t`To start interacting with ErgoDEX Cardano testnet user interface you
            need to get test tokens.`}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Footnote>
            {t`Note: you may receive tokens only once per wallet.`}
          </Typography.Footnote>
        </Flex.Item>
      </Flex>
    </>
  );

  notification.open({
    className: 'cardano-testnet-faucet',
    key: NOTIFICATION_KEY,
    message,
    duration: 0,
    placement: 'bottomLeft',
    bottom: 48,
    btn: <GetTokensButton />,
    closeIcon: <></>,
  });
};
