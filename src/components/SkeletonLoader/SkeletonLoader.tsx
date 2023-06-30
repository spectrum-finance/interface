import { Skeleton } from '@ergolabs/ui-kit';
import { FC } from 'react';

interface SkeletonLoaderProps {
  height?: number;
  width?: number;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({ height, width }) => {
  return (
    <Skeleton.Block
      style={{
        borderRadius: 'var(--spectrum-border-radius-l)',
        height,
        width,
      }}
      active
    />
  );
};
