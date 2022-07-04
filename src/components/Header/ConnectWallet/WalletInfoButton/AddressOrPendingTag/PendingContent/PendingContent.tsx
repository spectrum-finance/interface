import { Flex, LoadingOutlined } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { uint } from '../../../../../../common/types';
import { TagTypography } from '../TagTypography/TagTypography';

export interface PendingContentProps {
  readonly pendingCount: uint;
}

export const PendingContent: FC<PendingContentProps> = ({ pendingCount }) => (
  <TagTypography>
    <Flex align="center">
      <Flex.Item marginRight={2} marginLeft={2}>
        <LoadingOutlined />
      </Flex.Item>
      <Flex.Item marginRight={2}>{pendingCount} Pending</Flex.Item>
    </Flex>
  </TagTypography>
);
