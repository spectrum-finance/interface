import { Skeleton as BaseSkeleton } from 'antd';
import { SkeletonButtonProps } from 'antd/lib/skeleton/Button';
import cn from 'classnames';
import React from 'react';

interface Extensions {
  Block: typeof BaseSkeleton.Button;
}

const Skeleton: typeof BaseSkeleton & Extensions = BaseSkeleton as any;

// @ts-ignore
// eslint-disable-next-line react/display-name
Skeleton.Block = ({ className, ...rest }: SkeletonButtonProps) => {
  return (
    <Skeleton.Button
      className={cn('ant-skeleton-block', className)}
      {...rest}
    />
  );
};

export { Skeleton };
