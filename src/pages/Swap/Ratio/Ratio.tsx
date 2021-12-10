/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import React, { useEffect, useMemo } from 'react';
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
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable, useSubject } from '../../../hooks/useObservable';
import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';
import { SwapFormModel } from '../SwapModel';

export function renderPrice(x: AssetAmount, y: AssetAmount): string {
  const nameX = x.asset.name ?? x.asset.id.slice(0, 8);
  const nameY = y.asset.name ?? y.asset.id.slice(0, 8);
  const fmtX = renderFractions(x.amount, x.asset.decimals);
  const fmtY = renderFractions(y.amount, y.asset.decimals);
  const p = math.evaluate!(`${fmtY} / ${fmtX}`).toFixed(y.asset.decimals ?? 0);
  return `1 ${nameX} - ${p} ${nameY}`;
}

const calculateRatio = (value: SwapFormModel) => {
  return renderPrice(
    new AssetAmount(
      value?.fromAsset!,
      parseUserInputToFractions(
        value?.fromAmount?.value!,
        value?.fromAsset?.decimals!,
      ),
    ),
    new AssetAmount(
      value?.toAsset!,
      parseUserInputToFractions(
        value?.toAmount?.value!,
        value?.toAsset?.decimals!,
      ),
    ),
  );
};

export const Ratio = ({ form }: { form: FormGroup<SwapFormModel> }) => {
  const [ratio] = useObservable(
    form.valueChangesWithSilent$.pipe(
      map((value) => {
        if (
          value.fromAmount?.value &&
          value.fromAsset &&
          value.toAmount?.value &&
          value.toAsset &&
          value.pool
        ) {
          return calculateRatio(value);
        } else {
          return undefined;
        }
      }),
    ),
    { deps: [form] },
  );

  return <Typography.Body>{ratio}</Typography.Body>;
};
