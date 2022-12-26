import numeral from 'numeral';
import React from 'react';

import { LmPool } from '../../../common/models/LmPool';
import { LineProgress } from '../LineProgress/LineProgress';

interface ProgressProps {
  readonly lmPool: LmPool;
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
  return (
    <LineProgress
      percent={lmPool.distributed}
      height={height}
      width={width}
      className={className}
    />
  );
};
