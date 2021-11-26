/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import React, { useEffect } from 'react';
import {
  distinctUntilChanged,
  filter,
  interval,
  map,
  mapTo,
  of,
  startWith,
  tap,
} from 'rxjs';

import { TokenControlValue } from '../../../components/common/TokenControl/TokenControl';
import { FormInstance, Typography } from '../../../ergodex-cdk';
import { useObservableAction } from '../../../hooks/useObservable';
import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
  readonly pool?: AmmPool;
}

export function renderPrice(x: AssetAmount, y: AssetAmount): string {
  const nameX = x.asset.name ?? x.asset.id.slice(0, 8);
  const nameY = y.asset.name ?? y.asset.id.slice(0, 8);
  const fmtX = renderFractions(x.amount, x.asset.decimals);
  const fmtY = renderFractions(y.amount, y.asset.decimals);
  const p = math.evaluate!(`${fmtY} / ${fmtX}`).toFixed(y.asset.decimals ?? 0);
  return `1 ${nameX} - ${p} ${nameY}`;
}

const calculateRatio = (form: FormInstance<SwapFormModel>) =>
  interval(100).pipe(
    startWith(),
    map(() => form.getFieldsValue()),
    filter((value) => {
      return (
        value.from?.amount?.value &&
        value.to?.amount?.value &&
        value.from.asset?.id &&
        (value.to.asset?.id as any)
      );
    }),
    distinctUntilChanged(
      (valueA, valueB) =>
        valueA?.from?.amount?.value === valueB?.from?.amount?.value &&
        valueA?.to?.amount?.value === valueB?.to?.amount?.value,
    ),
    map((value) => {
      return renderPrice(
        new AssetAmount(
          value?.from?.asset!,
          parseUserInputToFractions(
            value?.from?.amount?.value!,
            value?.from?.asset?.decimals!,
          ),
        ),
        new AssetAmount(
          value?.to?.asset!,
          parseUserInputToFractions(
            value?.to?.amount?.value!,
            value?.to?.asset?.decimals!,
          ),
        ),
      );
    }),
  );

export const Ratio = ({ form }: { form: FormInstance }) => {
  const [ratio, updateRatio] = useObservableAction(calculateRatio);

  useEffect(() => {
    updateRatio(form);
  }, [form, updateRatio]);

  return <Typography.Body>{ratio}</Typography.Body>;
};
