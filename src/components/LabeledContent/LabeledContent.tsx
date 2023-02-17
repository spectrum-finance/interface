import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';

import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

export interface LabeledContentProps {
  readonly label: ReactNode | ReactNode[] | string;
  readonly extra?: ReactNode | ReactNode[] | string;
  readonly tooltipContent?: ReactNode | ReactNode[] | string;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const LabeledContent: FC<LabeledContentProps> = ({
  label,
  tooltipContent,
  extra,
  children,
}) => (
  <Flex col>
    <Flex.Item
      marginBottom={2}
      display="flex"
      justify="space-between"
      align="center"
    >
      {tooltipContent && (
        <InfoTooltip secondary width={200} content={tooltipContent}>
          <Typography.Body>{label}</Typography.Body>
        </InfoTooltip>
      )}
      {!tooltipContent && <Typography.Body>{label}</Typography.Body>}
      {extra}
    </Flex.Item>
    {children}
  </Flex>
);
