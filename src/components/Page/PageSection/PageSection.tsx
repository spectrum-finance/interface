import { Flex, Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { FormSpace } from '../../common/FormView/FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  noBorder?: boolean;
  boxed?: boolean;
}

const PageSection: React.FC<FormSectionProps> = ({
  children,
  title,
  noPadding,
  noBorder,
  boxed,
}) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      {boxed || boxed === undefined ? (
        <FormSpace noBorder={noBorder} noPadding={noPadding}>
          {children}
        </FormSpace>
      ) : (
        children
      )}
    </Flex>
  );
};

export { PageSection };
