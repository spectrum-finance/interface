import { Box, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { formatToFeePercent } from '../../../../services/number.ts';

interface PoolFeeTagProps {
  readonly ammPool: AmmPool;
}

export const PoolFeeTag: FC<PoolFeeTagProps> = ({ ammPool }) => (
  <Box padding={[0.5, 1]} secondary borderRadius="m">
    <Typography.Body size="small">
      {formatToFeePercent(ammPool.poolFee)}%
    </Typography.Body>
  </Box>
);
