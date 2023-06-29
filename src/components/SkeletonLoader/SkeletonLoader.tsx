import { Skeleton } from '@ergolabs/ui-kit';
import { FC } from 'react';

interface SkeletonLoaderProps {
  height: number;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({ height }) => {
  return (
    <Skeleton.Block
      style={{
        borderRadius: 'var(--spectrum-border-radius-l)',
        height,
      }}
      active
    />
  );
};
