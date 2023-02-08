import { Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { FormSpace } from '../../common/FormView/FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  boxed?: boolean;
  glass?: boolean;
}

const PageSection: React.FC<FormSectionProps> = ({
  children,
  title,
  noPadding,
  boxed,
  glass,
}) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      {boxed || boxed === undefined ? (
        <FormSpace glass={glass} noPadding={noPadding}>
          {children}
        </FormSpace>
      ) : (
        children
      )}
    </Flex>
  );
};

export { PageSection };
