import React from 'react';
import styled from 'styled-components';

import { Box, Flex, Skeleton, Typography } from '../../../ergodex-cdk';

interface DataTagProps {
  className?: string;
  content?: number | string;
  secondary?: boolean;
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
}

const _DataTag: React.FC<DataTagProps> = ({
  content,
  size,
  loading,
  className,
}) => {
  if (loading) {
    const br = size === 'small' ? '4px' : '8px';
    return <Skeleton.Block style={{ borderRadius: br }} active />;
  }

  if (size === 'small') {
    return (
      <Box
        className={className}
        borderRadius={'xs'}
        padding={[0, 1]}
        bordered={false}
      >
        <Flex justify="center">
          <Typography.Body small>{content}</Typography.Body>
        </Flex>
      </Box>
    );
  } else if (size === 'large') {
    return (
      <Box className={className} borderRadius="s" padding={1} bordered={false}>
        <Flex justify="center">
          <Typography.Title level={5}>{content}</Typography.Title>
        </Flex>
      </Box>
    );
  }

  return (
    <Box className={className} borderRadius="s" padding={1} bordered={false}>
      <Flex justify="center">
        <Typography.Body strong>{content}</Typography.Body>
      </Flex>
    </Box>
  );
};

export const DataTag = styled(_DataTag)`
  background: var(--ergo-tag-primary) !important;

  ${(props) =>
    props.secondary && 'background: var(--ergo-tag-secondary) !important'}
`;
