import { Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip.tsx';
import { SwapFormModel } from '../../SwapFormModel';
import { SwapInfoItem } from '../SwapInfoItem/SwapInfoItem';

export interface SwapInfoPriceImpactProps {
  value: SwapFormModel;
}

type IpriceImpactStatus = 'success' | 'warning' | 'danger' | undefined;

const getPriceImpactStatus = (
  priceImpact: number | undefined,
): IpriceImpactStatus => {
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

const isDangerPriceImpactStatus = (priceImpactStatus: IpriceImpactStatus) => {
  return priceImpactStatus === 'danger';
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
        isDangerPriceImpactStatus(priceImpactStatus) ? (
          <InfoTooltip
            width={300}
            content={
              <Trans>
                This swap could lead to potential losses! The price impact is
                currently significant due to the existing liquidity in the pool.
                Ensure you fully understand the implications before moving
                forward.
              </Trans>
            }
            color="danger"
            defaultVisible
          >
            <Typography.Body type={priceImpactStatus} size="small">
              {priceImpact !== undefined ? `${priceImpact}%` : '–'}
            </Typography.Body>
          </InfoTooltip>
        ) : (
          <Typography.Body type={priceImpactStatus} size="small">
            {priceImpact !== undefined ? `${priceImpact}%` : '–'}
          </Typography.Body>
        )
      }
    />
  );
};
