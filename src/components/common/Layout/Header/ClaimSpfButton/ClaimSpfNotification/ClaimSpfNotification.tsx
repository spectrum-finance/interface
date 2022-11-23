import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { SpfReward } from '../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ReactComponent as SpfTokenIcon } from '../spf-token.svg';
import { ReactComponent as BottomBackground } from './bottom-background.svg';

export interface ClaimSpfNotificationProps {
  readonly className?: string;
  readonly reward: SpfReward;
  readonly visible?: boolean;
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
          {reward.total.toCurrencyString()}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body size="large" strong>
          <Trans>Claim has arrived</Trans>
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Body size="small" align="center">
          <Trans>
            Thanks for being a long time <br /> supporter of the Spectrum
            Finance
          </Trans>
        </Typography.Body>
      </Flex.Item>
      <Button
        type="primary"
        size="large"
        style={{ width: '100%' }}
        onClick={onClick}
      >
        <Trans>Claim SPF</Trans>
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
  position: fixed;
  right: 24px;
  top: 80px;
  transition: opacity 0.3s;
  width: 280px;

  ${(props) =>
    props.visible
      ? css`
          visibility: visible;
          opacity: 1;
        `
      : css`
          visibility: hidden;
          opacity: 0;
        `}
`;
