import React, { FC, ReactNode } from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { Flex, Typography } from '../../../../ergodex-cdk';

export interface SwapInfoItemProps {
  title: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  secondary?: boolean;
}

export const SwapInfoItem: FC<SwapInfoItemProps> = ({
  value,
  title,
  tooltip,
  secondary,
}) => (
  <Flex align="center" justify="space-between">
    <Flex.Item align="center">
      <Flex.Item marginRight={1}>
        <Typography.Body secondary={secondary}>{title}</Typography.Body>
      </Flex.Item>
      <Flex.Item>
        {tooltip && <InfoTooltip width={300} content={tooltip} secondary />}
      </Flex.Item>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body secondary={secondary}>{value}</Typography.Body>
    </Flex.Item>
  </Flex>
);
