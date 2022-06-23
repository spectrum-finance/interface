import { Skeleton } from '@ergolabs/ui-kit';
import React from 'react';

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
