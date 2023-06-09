import { Flex, Tag, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import * as React from 'react';

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
        padding: 'calc(var(--spectrum-base-gutter) * 4)',
        borderRadius: 'var(--spectrum-border-radius-l)',
      }}
      color="warning"
    >
      <Flex col align="flex-start">
        <Flex.Item marginBottom={2}>
          <Typography.Body>
            <Trans>
              {network.networkAsset.name} balance is low. You need{' '}
              {network.networkAsset.name} to pay transaction fees
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
