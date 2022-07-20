import './CalalystF9.less';

import {
  Button,
  CloseOutlined,
  Flex,
  notification,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React from 'react';

import { panalytics } from '../../../common/analytics';
import { localStorageManager } from '../../../common/utils/localStorageManager';

export const NOTIFICATION_KEY = 'catalyst-notification';

const LetsGoButton = () => {
  const openModal = () => {
    window.open('https://linktr.ee/ergodex_f9', '_blank');
    panalytics.catalystCta();
    localStorageManager.set(NOTIFICATION_KEY, true);
    notification.close(NOTIFICATION_KEY);
  };

  return (
    <Button type="primary" onClick={openModal}>
      {t`Let’s go!`}
    </Button>
  );
};

const CatalystF9NotificationMessage: React.FC = () => (
  <Flex col>
    <Flex.Item marginBottom={2}>
      <Typography.Title level={4}>{t`We are on Catalyst F9!`}</Typography.Title>
    </Flex.Item>
    <Flex.Item>
      <Typography.Footnote>
        {t`Do you want cross-chain native asset DeFi that will be extremely fast and cheap? Check out our proposal on Project Catalyst F9, register till August 4 and vote! Let’s develop the cross-chain future together.`}
      </Typography.Footnote>
    </Flex.Item>
  </Flex>
);

export const openCatalystF9Notification = (): void => {
  if (localStorageManager.get<boolean>(NOTIFICATION_KEY)) {
    return;
  }

  notification.open({
    className: 'catalyst-f9-notification',
    key: NOTIFICATION_KEY,
    message: <CatalystF9NotificationMessage />,
    duration: 0,
    placement: 'bottomLeft',
    bottom: 48,
    btn: <LetsGoButton />,
    closeIcon: <CloseOutlined size={24} />,
    onClose: () => {
      panalytics.catalystClose();
      localStorageManager.set(NOTIFICATION_KEY, true);
    },
  });
};
