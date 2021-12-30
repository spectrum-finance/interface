import './PriceIndicator.less';

import React, { useState } from 'react';
import { debounceTime, map, tap } from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { Typography } from '../../../ergodex-cdk';
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable } from '../../../hooks/useObservable';
import { SwapFormModel } from '../SwapFormModel';

const calculateOutputRatio = ({
  fromAmount,
  fromAsset,
  pool,
}: Required<SwapFormModel>): Currency => {
  if (fromAmount?.isPositive()) {
    return pool.calculateOutputRatio(fromAmount);
  } else {
    return pool.calculateOutputRatio(new Currency('1', fromAsset));
  }
};

const calculateInputRatio = ({
  toAmount,
  toAsset,
  pool,
}: Required<SwapFormModel>): Currency => {
  if (toAmount?.isPositive()) {
    return pool.calculateInputRatio(toAmount);
  } else {
    return pool.calculateInputRatio(new Currency('1', toAsset));
  }
};

export const PriceIndicator = ({
  form,
}: {
  form: FormGroup<SwapFormModel>;
}) => {
  const [reversed, setReversed] = useState(false);
  const [ratio] = useObservable(
    form.valueChangesWithSilent$.pipe(
      map((value) => {
        if (!value.pool || !value.fromAsset) {
          return undefined;
        }
        if (reversed) {
          return calculateInputRatio(value as Required<SwapFormModel>);
        } else {
          return calculateOutputRatio(value as Required<SwapFormModel>);
        }
      }),
      debounceTime(100),
      map((price) =>
        reversed
          ? `1 ${form.value.toAsset?.name} - ${price?.toString()}`
          : `1 ${form.value.fromAsset?.name} - ${price?.toString()}`,
      ),
    ),
    { deps: [form, reversed] },
  );

  const toggleReversed = () => setReversed((reversed) => !reversed);

  return (
    <>
      {form.value.pool && (
        <Typography.Body className="price-indicator" onClick={toggleReversed}>
          {ratio}
        </Typography.Body>
      )}
    </>
  );
};
