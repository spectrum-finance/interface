import './СardanoFaucet.less';

import { t } from '@lingui/macro';
import React from 'react';

import { localStorageManager } from '../../../common/utils/localStorageManager';
import {
  FAUCET_KEY,
  FaucetModal,
} from '../../../components/FaucetModal/FaucetModal';
import {
  Button,
  CloseOutlined,
  Flex,
  Modal,
  notification,
  Typography,
} from '../../../ergodex-cdk';

export const NOTIFICATION_KEY = 'faucet-notification';

const GetTokensButton = () => {
  const openModal = () => {
    Modal.open(({ close }) => <FaucetModal close={close} />, {
      afterClose: () => {
        if (!localStorageManager.get<boolean>(FAUCET_KEY)) {
          openCardanoFaucetNotification();
        }
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

  if (localStorageManager.get<boolean>(FAUCET_KEY)) {
    return;
  }

  notification.open({
    className: 'cardano-testnet-faucet cardano',
    key: NOTIFICATION_KEY,
    message,
    duration: 0,
    placement: 'bottomLeft',
    bottom: 48,
    btn: <GetTokensButton />,
    closeIcon: <CloseOutlined size={24} />,
    onClose: () => localStorageManager.set(FAUCET_KEY, true),
  });
};
