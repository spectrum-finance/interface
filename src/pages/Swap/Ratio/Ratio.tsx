/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import React from 'react';
import { map } from 'rxjs';

import { Typography } from '../../../ergodex-cdk';
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable } from '../../../hooks/useObservable';
import { Currency } from '../../../services/new/currency';
import { math, renderFractions } from '../../../utils/math';
import { SwapFormModel } from '../SwapModel';

export function renderPrice(x: Currency, y: Currency): string {
  const nameX = x.asset.name;
  const nameY = y.asset.name;
  const fmtX = renderFractions(x.amount, x.asset.decimals);
  const fmtY = renderFractions(y.amount, y.asset.decimals);
  const p = math.evaluate!(`${fmtY} / ${fmtX}`).toFixed(y.asset.decimals ?? 0);
  return `1 ${nameX} - ${p} ${nameY}`;
}

export const Ratio = ({ form }: { form: FormGroup<SwapFormModel> }) => {
  const [ratio] = useObservable(
    form.valueChangesWithSilent$.pipe(
      map((value) => {
        if (
          value.fromAmount?.isPositive() &&
          value.toAmount?.isPositive() &&
          value.pool
        ) {
          return renderPrice(value.fromAmount, value.toAmount);
        } else {
          return undefined;
        }
      }),
    ),
    { deps: [form] },
  );

  return <Typography.Body>{ratio}</Typography.Body>;
};
