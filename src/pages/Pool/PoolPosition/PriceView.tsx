import './PoolPosition.less';

import React from 'react';

import { Box, Row, Typography } from '../../../ergodex-cdk';

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
      <Row justify="center">
        <Typography.Title level={2}>{price}</Typography.Title>
      </Row>
      <Row justify="center" topGutter={2}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {desc}
        </Typography.Text>
      </Row>
    </Box>
  );
};
