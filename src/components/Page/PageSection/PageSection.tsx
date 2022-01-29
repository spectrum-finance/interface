import React from 'react';

import { Flex, Typography } from '../../../ergodex-cdk';
import { FormSpace } from '../../common/FormView/FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
  boxed?: boolean;
}

const PageSection: React.FC<FormSectionProps> = ({
  children,
  title,
  noPadding,
  boxed,
}) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      {boxed || boxed === undefined ? (
        <FormSpace noPadding={noPadding}>{children}</FormSpace>
      ) : (
        children
      )}
    </Flex>
  );
};

export { PageSection };
