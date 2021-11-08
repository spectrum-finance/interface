import React from 'react';

import { Box, Typography } from '../../../ergodex-cdk';
import { getPoolFee } from '../../../utils/pool';

interface FeeTagProps {
  fee: bigint;
  contrast?: boolean;
}

const FeeTag: React.FC<FeeTagProps> = ({ fee, contrast }) => {
  const _fee = getPoolFee(fee);

  return (
    <Box contrast={contrast} borderRadius="s">
      <Typography.Body strong>{_fee}%</Typography.Body>
    </Box>
  );
};

export { FeeTag };
