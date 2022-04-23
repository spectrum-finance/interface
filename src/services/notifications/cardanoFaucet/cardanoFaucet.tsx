import './cardanoFaucet.less';

import React from 'react';

import { Button, Flex, notification, Typography } from '../../../ergodex-cdk';

export const openCardanoFaucetNotification = (): void => {
  const key = 'faucet-notification';

  const getTestTokens = () => {
    console.log('receive tokens');
  };

  const btn = (
    <Button type="primary" onClick={getTestTokens}>
      Get testnet tokens
    </Button>
  );

  const message = (
    <>
      <Flex col>
        <Flex.Item>
          <Typography.Title level={4}>Get your testnet tokens</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body>
            To start interacting with ErgoDEX Cardano testnet user interface you
            need to get test tokens.
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Footnote>
            Note: you may receive tokens only once per wallet.
          </Typography.Footnote>
        </Flex.Item>
      </Flex>
    </>
  );

  notification.open({
    className: 'cardano-testnet-faucet',
    key,
    message,
    duration: 0,
    placement: 'bottomLeft',
    bottom: 48,
    btn,
  });
};
