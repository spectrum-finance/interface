import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';

export interface SwapInfoItemProps {
  title: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  secondary?: boolean;
  hint?: boolean;
}

export const SwapInfoItem: FC<SwapInfoItemProps> = ({
  value,
  title,
  tooltip,
  secondary,
  hint,
}) => (
  <Flex align="center" justify="space-between">
    <Flex.Item>
      {tooltip ? (
        <InfoTooltip
          width={300}
          content={tooltip}
          secondary={secondary || hint}
        >
          <Typography.Body size="small" secondary={secondary} hint={hint}>
            {title}
          </Typography.Body>
        </InfoTooltip>
      ) : (
        <Typography.Body size="small" secondary={secondary} hint={hint}>
          {title}
        </Typography.Body>
      )}
      <Typography.Body size="small" secondary={secondary} hint={hint}>
        :
      </Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body size="small" secondary={secondary} hint={hint}>
        {value}
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
