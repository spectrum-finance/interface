import React, { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToConvenientNetworkAsset } from '../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { LoadingOutlined } from '../../ergodex-cdk';

export interface UsdViewProps {
  readonly value: Currency | Currency[] | undefined;
  readonly prefix?: string;
  readonly defaultValue?: string;
}

export const UsdView: FC<UsdViewProps> = ({ value, prefix, defaultValue }) => {
  const usdValue$ = useMemo(
    () => (value ? convertToConvenientNetworkAsset(value) : of(undefined)),
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  const [usdValue, isLoadingUsdValue] = useObservable(
    usdValue$,
    value instanceof Array ? [value] : [value?.amount, value?.asset?.id],
  );

  return (
    <>
      {isLoadingUsdValue ? (
        <LoadingOutlined />
      ) : value && usdValue?.toString() !== '0' ? (
        `${prefix}$${usdValue?.toString()}`
      ) : defaultValue ? (
        defaultValue
      ) : (
        '-'
      )}
    </>
  );
};
