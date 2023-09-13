import { Tooltip, Typography, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

export interface PriceImpactProps {
  value?: number;
}

type IpriceImpactStatus = 'secondary' | 'warning' | 'danger' | undefined;

const getPriceImpactStatus = (
  priceImpact: number | undefined,
): IpriceImpactStatus => {
  if (priceImpact === undefined) {
    return undefined;
  }
  if (priceImpact < 1) {
    return 'secondary';
  }
  if (1 <= priceImpact && priceImpact <= 5) {
    return 'warning';
  }
  return 'danger';
};

export const PriceImpact: FC<PriceImpactProps> = ({ value }) => {
  const { valBySize } = useDevice();
  const priceImpactStatus = getPriceImpactStatus(value);

  console.log('>>price impact value', value);

  return (
    <>
      {value !== undefined && (
        <Tooltip
          placement={'rightTop'}
          width={300}
          title={t`The estimated difference between the USD values of input and output amounts.`}
        >
          {'secondary' === priceImpactStatus ? (
            <Typography.Body secondary size={valBySize('small', 'base')}>
              {`(${value}%)`}
            </Typography.Body>
          ) : (
            <Typography.Body
              type={priceImpactStatus}
              size={valBySize('small', 'base')}
            >
              {`(${value}%)`}
            </Typography.Body>
          )}
        </Tooltip>
      )}
    </>
  );
};
