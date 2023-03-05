import { Box, Flex } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { DataTag } from '../../../../common/DataTag/DataTag';

interface AssetBoxProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly value: ReactNode | ReactNode[] | string;
  readonly className?: string;
}
const _AssetBox: FC<AssetBoxProps> = ({ title, value, className }) => (
  <Box padding={[1, 2]} className={className} borderRadius="m">
    <Flex align="center">
      <Flex.Item marginRight={1} flex={1}>
        {title}
      </Flex.Item>
      <DataTag accent content={value} size="extra-small" />
    </Flex>
  </Box>
);

export const AssetBox = styled(_AssetBox)`
  border-color: var(--spectrum-asset-box-border-color);
`;
