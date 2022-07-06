import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

interface SectionProps {
  readonly tooltip?: ReactNode | ReactNode[] | string;
  readonly tooltipWidth?: number;
  readonly gap?: number;
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly extra?: ReactNode | ReactNode[] | string;
}

export const Section: FC<SectionProps> = ({
  tooltip,
  tooltipWidth,
  gap,
  extra,
  title,
  children,
}) => (
  <Flex col>
    <Flex.Item align="center" marginBottom={gap || 1}>
      <Flex.Item align="center" flex={1}>
        <Flex.Item marginRight={1}>
          <Typography.Body strong>{title}</Typography.Body>
        </Flex.Item>
        {tooltip && <InfoTooltip width={tooltipWidth} content={tooltip} />}
      </Flex.Item>
      {extra}
    </Flex.Item>
    {children}
  </Flex>
);
