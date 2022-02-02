import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { Box, Typography } from '../../../ergodex-cdk';

interface PoolFeeTagProps {
  readonly ammPool: AmmPool;
}

export const PoolFeeTag: FC<PoolFeeTagProps> = ({ ammPool }) => (
  <Box padding={[0.5, 1]} contrast>
    <Typography.Text style={{ fontSize: '12px' }}>
      {ammPool.poolFee}%
    </Typography.Text>
  </Box>
);
