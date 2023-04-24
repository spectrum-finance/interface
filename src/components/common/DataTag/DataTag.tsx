import { Box, Flex, FlexProps, Skeleton, Typography } from '@ergolabs/ui-kit';
import { ReactNode } from 'react';
import * as React from 'react';
import styled from 'styled-components';

interface DataTagProps {
  className?: string;
  content?: number | string | ReactNode | ReactNode[];
  secondary?: boolean;
  accent?: boolean;
  size?: 'extra-small' | 'small' | 'default' | 'middle' | 'large';
  width?: number;
  justify?: FlexProps['justify'];
  loading?: boolean;
}

const _DataTag: React.FC<DataTagProps> = ({
  content,
  size,
  loading,
  justify,
  className,
  width,
  secondary,
  accent,
}) => {
  if (loading) {
    const br = size === 'small' ? '4px' : '8px';
    return <Skeleton.Block style={{ borderRadius: br }} active />;
  }

  if (size === 'extra-small') {
    return (
      <Box
        accent={accent}
        secondary={secondary}
        width={width}
        className={className}
        borderRadius={'s'}
        padding={[0.5, 1]}
        bordered={false}
      >
        <Flex justify={justify || 'center'}>
          <Typography.Body size="extra-small">{content}</Typography.Body>
        </Flex>
      </Box>
    );
  } else if (size === 'small') {
    return (
      <Box
        accent={accent}
        width={width}
        className={className}
        borderRadius="s"
        secondary={secondary}
        padding={[0, 1]}
        bordered={false}
      >
        <Flex justify={justify || 'center'}>
          <Typography.Body size="small">{content}</Typography.Body>
        </Flex>
      </Box>
    );
  } else if (size === 'default') {
    return (
      <Box
        accent={accent}
        width={width}
        className={className}
        borderRadius="s"
        secondary={secondary}
        padding={[0.5, 1]}
        bordered={false}
      >
        <Flex justify={justify || 'center'}>
          <Typography.Body
            strong
            style={{ fontSize: '12px', lineHeight: '20px' }}
          >
            {content}
          </Typography.Body>
        </Flex>
      </Box>
    );
  } else if (size === 'large') {
    return (
      <Box
        accent={accent}
        className={className}
        borderRadius="s"
        secondary={secondary}
        padding={1}
        bordered={false}
        width={width}
      >
        <Flex justify={justify || 'center'}>
          <Typography.Body size="large" strong>
            {content}
          </Typography.Body>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      borderRadius="s"
      secondary={secondary}
      padding={1}
      bordered={false}
      width={width}
    >
      <Flex justify={justify || 'center'}>
        <Typography.Body strong>{content}</Typography.Body>
      </Flex>
    </Box>
  );
};

export const DataTag = styled(_DataTag)``;
// background: var(--spectrum-tag-primary) !important;
//
// ${(props) =>
//   props.secondary && 'background: var(--spectrum-tag-secondary) !important'}
