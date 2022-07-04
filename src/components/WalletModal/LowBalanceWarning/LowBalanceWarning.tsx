import { Flex, Tag, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { applicationConfig } from '../../../applicationConfig';
import { Network } from '../../../network/common/Network';

interface LowBalanceWarningProps {
  network: Network<any, any>;
}

const LowBalanceWarning: React.FC<LowBalanceWarningProps> = ({
  network,
}): JSX.Element => {
  return (
    <Tag
      style={{
        width: '100%',
        padding: 'calc(var(--ergo-base-gutter) * 4)',
      }}
      color="warning"
    >
      <Flex direction="col" align="flex-start">
        <Flex.Item>
          <Typography.Title level={5}>
            <Trans>{network.networkAsset.name} balance is low</Trans>
          </Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body>
            <Trans>
              You need {network.networkAsset.name} to pay transaction fees
            </Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Link
            href={
              applicationConfig.networksSettings[network.name].lowBalanceGuide
            }
            target="_blank"
          >
            <Trans>Learn how to get {network.networkAsset.name}</Trans>
          </Typography.Link>
        </Flex.Item>
      </Flex>
    </Tag>
  );
};

export { LowBalanceWarning };
