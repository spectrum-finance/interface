import React from 'react';

import { Farm } from '../../../common/models/Farm';

interface ProgressProps {
  readonly lmPool: Farm;
  readonly height?: number;
  readonly width?: number | string;
  readonly className?: string;
}
export const FarmLineProgress = ({
  lmPool,
  height,
  width,
  className,
}: ProgressProps) => {
  return null;
  // return (
  //   <LineProgress
  //     percent={lmPool.distributed}
  //     height={height}
  //     width={width}
  //     className={className}
  //   />
  // );
};
