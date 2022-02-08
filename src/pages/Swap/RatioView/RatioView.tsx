import './Ratio.less';

import React, { FC, useState } from 'react';
import { debounceTime, map, tap } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Ratio } from '../../../common/models/Ratio';
import { Animation, Typography } from '../../../ergodex-cdk';
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { SwapFormModel } from '../SwapFormModel';

const calculateOutputPrice = ({
  fromAmount,
  fromAsset,
  pool,
}: Required<SwapFormModel>): Ratio => {
  if (fromAmount?.isPositive()) {
    return pool.calculateOutputPrice(fromAmount);
  } else {
    return pool.calculateOutputPrice(new Currency('1', fromAsset));
  }
};

const calculateInputPrice = ({
  toAmount,
  toAsset,
  pool,
}: Required<SwapFormModel>): Ratio => {
  if (toAmount?.isPositive()) {
    return pool.calculateInputPrice(toAmount);
  } else {
    return pool.calculateInputPrice(new Currency('1', toAsset));
  }
};

export const RatioView: FC<{ form: FormGroup<SwapFormModel> }> = ({ form }) => {
  const [reversedRatio, setReversedRatio] = useState(false);
  const [ratio] = useObservable(
    form.valueChangesWithSilent$.pipe(
      debounceTime(100),
      map((value) => {
        if (!value.pool || !value.fromAsset) {
          return undefined;
        }

        if (reversedRatio) {
          return calculateInputPrice(value as Required<SwapFormModel>);
        } else {
          return calculateOutputPrice(value as Required<SwapFormModel>);
        }
      }),
      map((price) =>
        reversedRatio
          ? `1 ${form.value.toAsset?.name} = ${price?.toString()}`
          : `1 ${form.value.fromAsset?.name} = ${price?.toString()}`,
      ),
    ),
    [form, reversedRatio],
  );

  const toggleReversedRatio = () =>
    setReversedRatio((reversedRatio) => !reversedRatio);

  return (
    <Animation.Expand expanded={!!form.value.pool}>
      <Typography.Body className="ratio" onClick={toggleReversedRatio}>
        {ratio}
      </Typography.Body>
    </Animation.Expand>
  );
};
