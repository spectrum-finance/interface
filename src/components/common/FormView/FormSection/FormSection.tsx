import React from 'react';

import { Flex, Typography } from '../../../../ergodex-cdk';
import { FormSpace } from '../FormSpace/FormSpace';

interface FormSectionProps {
  title: string;
  children: React.ReactChild | React.ReactChild[];
}

const FormSection: React.FC<FormSectionProps> = ({ children, title }) => {
  return (
    <Flex direction="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <FormSpace>{children}</FormSpace>
      </Flex.Item>
    </Flex>
  );
};

export { FormSection };
