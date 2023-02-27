import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { ReactNode } from 'react';

import { FormSpace } from '../../common/FormView/FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
  subtitle?: ReactNode | ReactNode[] | string;
  noPadding?: boolean;
  noBorder?: boolean;
  boxed?: boolean;
  glass?: boolean;
  height?: number;
}

const PageSection: React.FC<FormSectionProps> = ({
  children,
  title,
  subtitle,
  noPadding,
  noBorder,
  boxed,
  glass,
  height,
}) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={subtitle ? 1 : 2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      {subtitle && <Flex.Item marginBottom={2}>{subtitle}</Flex.Item>}
      {boxed || boxed === undefined ? (
        <FormSpace
          height={height}
          noBorder={noBorder}
          glass={glass}
          noPadding={noPadding}
        >
          {children}
        </FormSpace>
      ) : (
        children
      )}
    </Flex>
  );
};

export { PageSection };
