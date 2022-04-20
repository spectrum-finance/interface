import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../../common/models/Currency';
import { Ratio } from '../../../../../common/models/Ratio';
import { Typography } from '../../../../../ergodex-cdk';
import { SwapFormModel } from '../../../SwapFormModel';

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

export interface RatioViewProps {
  readonly value: SwapFormModel;
  readonly className?: string;
}

const createRatioString = (
  value: SwapFormModel,
  reversedRatio: boolean,
): string | undefined => {
  if (!value.pool || !value.fromAsset) {
    return undefined;
  }

  const price = reversedRatio
    ? calculateInputPrice(value as Required<SwapFormModel>)
    : calculateOutputPrice(value as Required<SwapFormModel>);

  return reversedRatio
    ? `1 ${value.toAsset?.name} = ${price?.toString()} ${price?.baseAsset.name}`
    : `1 ${value.fromAsset?.name} = ${price?.toString()} ${
        price?.baseAsset.name
      }`;
};

const _RatioView: FC<RatioViewProps> = ({ value, className }) => {
  const [reversedRatio, setReversedRatio] = useState(false);

  const toggleReversedRatio = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    setReversedRatio((reversedRatio) => !reversedRatio);
  };

  return (
    <Typography.Body className={className} onClick={toggleReversedRatio}>
      {createRatioString(value, reversedRatio)}
    </Typography.Body>
  );
};

export const RatioView = styled(_RatioView)`
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;
