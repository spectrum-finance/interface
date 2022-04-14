import React, { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToUsd } from '../../api/convertToUsd';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { LoadingOutlined } from '../../ergodex-cdk';

export interface UsdViewProps {
  readonly value: Currency | undefined;
  readonly prefix?: string;
  readonly defaultValue?: string;
}

export const UsdView: FC<UsdViewProps> = ({ value, prefix, defaultValue }) => {
  const usdValue$ = useMemo(
    () => (value ? convertToUsd(value) : of(undefined)),
    [value?.amount, value?.asset?.id],
  );

  const [usdValue, isLoadingUsdValue] = useObservable(usdValue$, [
    value?.amount,
    value?.asset?.id,
  ]);

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
