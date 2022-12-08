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
  const getPercent = () => {
    if (Number(lmPool.reward.toAmount()) === 0) {
      return 100;
    }

    if (Number(lmPool.programBudget) === Number(lmPool.reward.toAmount())) {
      return 0;
    }

    return Number(
      numeral(lmPool.programBudget)
        .subtract(lmPool.reward.toAmount())
        .divide(lmPool.programBudget)
        .multiply(100)
        .format('00.00'),
    );
  };

  return (
    <LineProgress
      percent={getPercent()}
      height={height}
      width={width}
      className={className}
    />
  );
};
