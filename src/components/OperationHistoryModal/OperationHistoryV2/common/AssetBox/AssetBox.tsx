import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { DataTag } from '../../../../common/DataTag/DataTag';

interface AssetBoxProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly value: ReactNode | ReactNode[] | string;
  readonly icon?: ReactNode | ReactNode[] | string;
  readonly className?: string;
}
const _AssetBox: FC<AssetBoxProps> = ({ title, value, className, icon }) => (
  <Box padding={[1, 2]} className={className} borderRadius="m" width={200}>
    <Flex align="center">
      {icon && (
        <Flex.Item marginRight={1}>
          <Typography.Body type="warning">{icon}</Typography.Body>
        </Flex.Item>
      )}
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
