import React from 'react';

import { Skeleton } from '../../../../ergodex-cdk';

const PositionListItemLoader = (): JSX.Element => {
  return (
    <Skeleton.Block
      style={{ height: '90px', borderRadius: '12px' }}
      size="large"
      active
    />
  );
};

export { PositionListItemLoader };
