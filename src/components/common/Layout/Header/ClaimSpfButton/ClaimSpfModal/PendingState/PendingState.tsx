import { Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { RewardInfo } from '../RewartInfo/RewardInfo';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 80px;
  color: var(--spectrum-primary-color);
`;

export const PendingState: FC = () => (
  <Flex col>
    <Flex.Item marginBottom={12}>
      <RewardInfo />
    </Flex.Item>
    <Flex.Item display="flex" justify="center" marginBottom={12}>
      <LoadingIcon />
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <Typography.Body>
        <Trans>
          You requested SPF reward on November 22, 2022 at 12:35 pm. Your reward
          will come to your wallet within 24 hours from the moment the request
          was created. Thank you for being with us!”
        </Trans>
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
