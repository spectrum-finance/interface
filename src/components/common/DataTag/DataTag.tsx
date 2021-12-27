import React from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';

interface DataTagProps {
  content?: number | string;
  contrast?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const DataTag: React.FC<DataTagProps> = ({ content, contrast, size }) => {
  if (size === 'small') {
    return (
      <Box contrast={contrast} borderRadius={'xs'} padding={[0, 1]}>
        <Flex justify="center">
          <Typography.Body small>{content}</Typography.Body>
        </Flex>
      </Box>
    );
  } else if (size === 'large') {
    return (
      <Box contrast={contrast} borderRadius="s" padding={1}>
        <Flex justify="center">
          <Typography.Title level={5}>{content}</Typography.Title>
        </Flex>
      </Box>
    );
  }

  return (
    <Box contrast={contrast} borderRadius="s" padding={1}>
      <Flex justify="center">
        <Typography.Body strong>{content}</Typography.Body>
      </Flex>
    </Box>
  );
};

export { DataTag };
