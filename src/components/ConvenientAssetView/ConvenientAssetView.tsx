import { LoadingOutlined } from '@ergolabs/ui-kit';
import { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToConvenientNetworkAsset } from '../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { formatToUSD } from '../../services/number';
import { SensitiveContent } from '../SensitiveContent/SensitiveContent.tsx';

export interface ConvenientAssetViewProps {
  readonly value: Currency | Currency[] | undefined;
  readonly isShort?: boolean;
  readonly sensitive?: boolean;
}

const SMALLEST_VALUE = 0.01;
const ZERO_VALUE = '0.00';

export const getConvenientValue = (
  convenientValue?: Currency,
  value?: Currency | Currency[],
  isShort = false,
): string => {
  if (!convenientValue || !value || value.toString() === '0') {
    return `$${ZERO_VALUE}`;
  } else if (Number(convenientValue.toString()) < SMALLEST_VALUE) {
    return `<$${SMALLEST_VALUE}`;
  }
  return formatToUSD(convenientValue, isShort ? 'abbr' : 'default');
};

export const ConvenientAssetView: FC<ConvenientAssetViewProps> = ({
  value,
  isShort = false,
  sensitive = false,
}) => {
  const convenientAssetValue$ = useMemo(
    () => (value ? convertToConvenientNetworkAsset(value) : of(undefined)),
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  const [convenientValue, isConvenientValueLoading] = useObservable(
    convenientAssetValue$,
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  return (
    <>
      {isConvenientValueLoading ? (
        <LoadingOutlined />
      ) : sensitive ? (
        <SensitiveContent>
          {getConvenientValue(convenientValue, value, isShort)}
        </SensitiveContent>
      ) : (
        getConvenientValue(convenientValue, value, isShort)
      )}
    </>
  );
};
