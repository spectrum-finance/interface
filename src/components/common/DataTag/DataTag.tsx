import React from 'react';

import { Box, Flex, Skeleton, Typography } from '../../../ergodex-cdk';

interface DataTagProps {
  content?: number | string;
  contrast?: boolean;
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
}

const DataTag: React.FC<DataTagProps> = ({
  content,
  contrast,
  size,
  loading,
}) => {
  if (loading) {
    const br = size === 'small' ? '4px' : '8px';
    return <Skeleton.Block style={{ borderRadius: br }} active />;
  }

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
