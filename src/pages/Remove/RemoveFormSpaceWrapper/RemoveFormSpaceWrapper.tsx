import React from 'react';

import { Flex, Typography } from '../../../ergodex-cdk';

const RemoveFormSpaceWrapper: React.FC<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <Flex flexDirection="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>{title}</Typography.Body>
      </Flex.Item>
      <Flex.Item>{children}</Flex.Item>
    </Flex>
  );
};

export { RemoveFormSpaceWrapper };
