import './ClaimSpfNotification.less';

import { Button, Flex, notification, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { localStorageManager } from '../../../../../../common/utils/localStorageManager';
import { SpfReward } from '../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ClaimSpfStatusResponse } from '../../../../../../network/ergo/api/spfFaucet/spfStatus';
import { ReactComponent as SpfTokenIcon } from '../spf-token.svg';
import { ReactComponent as BottomBackground } from './bottom-background.svg';

export interface ClaimSpfNotificationProps {
  readonly className?: string;
  readonly reward: SpfReward;
  readonly onClick?: () => void;
}

const BottomBackgroundContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: -6px;
`;

const _ClaimSpfNotification: FC<ClaimSpfNotificationProps> = ({
  className,
  reward,
  onClick,
}) => (
  <div className={className}>
    <BottomBackgroundContainer>
      <BottomBackground />
    </BottomBackgroundContainer>
    <Flex col align="center">
      <Flex.Item marginBottom={6}>
        <SpfTokenIcon />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Title level={4}>
          {reward.available.toCurrencyString()}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body size="large" strong>
          {t`Claim has arrived`}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Body size="small" align="center">
          {t`Thanks for being a long time`}
          <br />
          {t`supporter of the Spectrum Finance`}
        </Typography.Body>
      </Flex.Item>
      <Button
        type="primary"
        size="large"
        style={{ width: '100%' }}
        onClick={onClick}
      >
        {t`Claim SPF`}
      </Button>
    </Flex>
  </div>
);

export const ClaimSpfNotification = styled(_ClaimSpfNotification)`
  background: var(--spectrum-claim-spf-notifcation-background);
  border-radius: var(--spectrum-border-radius-xl);
  height: 300px;
  overflow: hidden;
  padding: calc(var(--spectrum-base-gutter) * 6)
    calc(var(--spectrum-base-gutter) * 2) calc(var(--spectrum-base-gutter) * 2);
  width: 280px;
`;

const CLAIM_SPF_STAGE = 'CLAIM_SPF_STAGE';
const CLAIM_SPF_NOTIFICATION_KEY = 'CLAIM_SPF_NOTIFICATION_KEY';

export const openClaimSpfNotification = (
  status: ClaimSpfStatusResponse,
  reward: SpfReward,
  onClick?: () => void,
): void => {
  if (localStorageManager.get(CLAIM_SPF_STAGE) === status.stage) {
    return;
  }

  notification.open({
    key: CLAIM_SPF_NOTIFICATION_KEY,
    message: <ClaimSpfNotification reward={reward} onClick={onClick} />,
    placement: 'topRightBackward' as any,
    duration: 0,
    btn: <></>,
    onClose: () => localStorageManager.set(CLAIM_SPF_STAGE, status.stage),
    className: 'claim-spf',
  });
};

export const hideClaimSpfNotification = (): void =>
  notification.close(CLAIM_SPF_NOTIFICATION_KEY);
