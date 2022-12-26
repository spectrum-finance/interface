import numeral from 'numeral';
import React from 'react';

import { Farm } from '../../../common/models/Farm';
import { LineProgress } from '../LineProgress/LineProgress';

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
  return (
    <LineProgress
      percent={lmPool.distributed}
      height={height}
      width={width}
      className={className}
    />
  );
};
