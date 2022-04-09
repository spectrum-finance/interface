import React, { FC, useMemo } from 'react';
import { of } from 'rxjs';

import { convertToUsd } from '../../api/convertToUsd';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';

export interface UsdViewProps {
  readonly value: Currency | undefined;
}

export const UsdView: FC<UsdViewProps> = ({ value }) => {
  const usdValue$ = useMemo(
    () => (value ? convertToUsd(value) : of(undefined)),
    [value?.amount, value?.asset?.id],
  );

  const [usdValue] = useObservable(usdValue$, [
    value?.amount,
    value?.asset?.id,
  ]);
  return <>~{value && usdValue?.toString()}$</>;
};
