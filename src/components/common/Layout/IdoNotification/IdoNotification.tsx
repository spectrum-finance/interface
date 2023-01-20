import './IdoNotification.less';

import {
  Button,
  Flex,
  localStorageManager,
  notification,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as BottomBackground } from './bottom-background.svg';
import { ReactComponent as SpfTokenIcon } from './spf-token.svg';

export interface IdoNotificationProps {
  readonly className?: string;
  readonly onClick?: () => void;
}

const BottomBackgroundContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: -6px;
`;

const _IdoNotification: FC<IdoNotificationProps> = ({ className, onClick }) => (
  <div className={className}>
    <BottomBackgroundContainer>
      <BottomBackground />
    </BottomBackgroundContainer>
    <Flex col align="center">
      <Flex.Item marginBottom={2}>
        <SpfTokenIcon />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>{t`You are invited`}</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Body align="center">
          {t`Participate in SPF token IDO`}
        </Typography.Body>
      </Flex.Item>
      <Button
        href="https://ido.spectrum.fi/"
        target="_blank"
        type="primary"
        size="large"
        style={{ width: '100%' }}
        onClick={onClick}
      >
        {t`Learn more`}
      </Button>
    </Flex>
  </div>
);

export const IdoNotification = styled(_IdoNotification)`
  background: var(--spectrum-ido-notifcation-background);
  border-radius: var(--spectrum-border-radius-xl);
  height: 300px;
  overflow: hidden;
  padding: calc(var(--spectrum-base-gutter) * 6)
    calc(var(--spectrum-base-gutter) * 2) calc(var(--spectrum-base-gutter) * 2);
  width: 280px;
`;

const IDO_CLOSED = 'IDO_CLOSED';
const IDO_NOTIFICATION_KEY = 'IDO_NOTIFICATION_KEY';

export const openIdoNotification = (): void => {
  if (localStorageManager.get(IDO_CLOSED)) {
    return;
  }

  notification.open({
    key: IDO_NOTIFICATION_KEY,
    message: <IdoNotification />,
    placement: 'topRightBackward' as any,
    duration: 0,
    btn: <></>,
    onClose: () => localStorageManager.set(IDO_CLOSED, true),
    className: 'spf-ido',
  });
};
