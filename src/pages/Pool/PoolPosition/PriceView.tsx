import './PoolPosition.less';

import React from 'react';

import { Box, Flex, Typography } from '../../../ergodex-cdk';

interface PriceViewProps {
  className: string;
  price: number;
  desc: string;
}

export const PriceView: React.FC<PriceViewProps> = ({
  className,
  price,
  desc,
}) => {
  return (
    <Box padding={3} borderRadius="s" className={className}>
      <Flex col justify="center" align="center">
        <Flex.Item>
          <Typography.Title level={5}>{price}</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {desc}
          </Typography.Text>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
