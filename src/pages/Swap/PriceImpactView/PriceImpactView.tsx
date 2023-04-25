import { Typography } from '@ergolabs/ui-kit';
import * as React from 'react';

import { SwapFormModel } from '../SwapFormModel';

interface PriceImpactViewProps {
  value: SwapFormModel;
}

const getPriceImpactStatus = (
  priceImpact: number | undefined,
): 'success' | 'warning' | 'danger' | undefined => {
  if (priceImpact === undefined) {
    return undefined;
  }
  if (priceImpact < 1) {
    return 'success';
  }
  if (1 <= priceImpact && priceImpact <= 5) {
    return 'warning';
  }
  return 'danger';
};

const PriceImpactView: React.FC<PriceImpactViewProps> = ({ value }) => {
  const priceImpact: number | undefined =
    value.fromAmount?.isPositive() &&
    value.toAmount?.isPositive() &&
    !!value.pool
      ? value.pool.calculatePriceImpact(value.fromAmount)
      : undefined;
  const priceImpactStatus = getPriceImpactStatus(priceImpact);
  return (
    <Typography.Body type={priceImpactStatus}>
      {priceImpact !== undefined ? `${priceImpact}%` : '–'}
    </Typography.Body>
  );
};

export { PriceImpactView };
