import './СardanoFaucet.less';

import { t } from '@lingui/macro';
import React from 'react';

import { FaucetModal } from '../../../components/FaucetModal/FaucetModal';
import {
  Button,
  Flex,
  Modal,
  notification,
  Typography,
} from '../../../ergodex-cdk';

const NOTIFICATION_KEY = 'faucet-notification';

const GetTokensButton = () => {
  const openModal = () => {
    Modal.open(({ close }) => <FaucetModal close={close} />, {
      afterClose: () => {
        openCardanoFaucetNotification();
      },
    });
    notification.close(NOTIFICATION_KEY);
  };

  return (
    <Button type="primary" onClick={openModal}>
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
            {t`Note: you may receive tokens only once per wallet per day.`}
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
