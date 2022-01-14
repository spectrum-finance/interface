import React from 'react';

import { Flex, Typography } from '../../../../ergodex-cdk';
import { FormSpace } from '../FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
  noPadding?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  noPadding,
}) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <FormSpace noPadding={noPadding}>{children}</FormSpace>
      </Flex.Item>
    </Flex>
  );
};

export { FormSection };
