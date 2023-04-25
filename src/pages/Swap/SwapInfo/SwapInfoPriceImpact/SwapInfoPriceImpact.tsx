import { Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { SwapFormModel } from '../../SwapFormModel';
import { SwapInfoItem } from '../SwapInfoItem/SwapInfoItem';

export interface SwapInfoPriceImpactProps {
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

export const SwapInfoPriceImpact: FC<SwapInfoPriceImpactProps> = ({
  value,
}) => {
  const priceImpact: number | undefined =
    value.fromAmount?.isPositive() &&
    value.toAmount?.isPositive() &&
    !!value.pool
      ? value.pool.calculatePriceImpact(value.fromAmount)
      : undefined;
  const priceImpactStatus = getPriceImpactStatus(priceImpact);

  return (
    <SwapInfoItem
      title={t`Price impact`}
      value={
        <Typography.Body type={priceImpactStatus} size="small">
          {priceImpact !== undefined ? `${priceImpact}%` : '–'}
        </Typography.Body>
      }
    />
  );
};
