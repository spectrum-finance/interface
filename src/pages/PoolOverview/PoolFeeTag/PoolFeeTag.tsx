import { Box, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';

interface PoolFeeTagProps {
  readonly ammPool: AmmPool;
}

export const PoolFeeTag: FC<PoolFeeTagProps> = ({ ammPool }) => (
  <Box padding={[0.5, 1]} secondary borderRadius="m">
    <Typography.Text style={{ fontSize: '12px' }}>
      {ammPool.poolFee}%
    </Typography.Text>
  </Box>
);
