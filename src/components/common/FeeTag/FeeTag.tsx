import React from 'react';

import { getPoolFee } from '../../../utils/pool';
import { DataTag } from '../DataTag/DataTag';

interface FeeTagProps {
  fee: bigint | number;
  contrast?: boolean;
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
}

const FeeTag: React.FC<FeeTagProps> = ({ fee, contrast, size, loading }) => {
  const _fee = typeof fee === 'number' ? fee : getPoolFee(fee);
  return (
    <DataTag
      content={`${_fee}%`}
      size={size}
      contrast={contrast}
      loading={loading}
    />
  );
};

export { FeeTag };
