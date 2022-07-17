import { Typography } from '@ergolabs/ui-kit';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../../common/models/Currency';
import { Ratio } from '../../../../../common/models/Ratio';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../SwapFormModel';

const calculateOutputPrice = ({
  fromAmount,
  fromAsset,
  pool,
}: Required<SwapFormModel>): Ratio => {
  if (fromAmount?.isPositive()) {
    return pool.calculateOutputPrice(fromAmount);
  } else {
    return pool.calculateOutputPrice(new Currency('0', fromAsset));
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
    return pool.calculateInputPrice(new Currency('0', toAsset));
  }
};

export interface RatioViewProps {
  readonly value: SwapFormModel;
  readonly className?: string;
}

interface RatioStringProps {
  value: SwapFormModel;
  reversedRatio: boolean;
}

const RatioString: React.FC<RatioStringProps> = ({ value, reversedRatio }) => {
  if (!value.pool || !value.fromAsset) {
    return <></>;
  }

  const price = reversedRatio
    ? calculateInputPrice(value as Required<SwapFormModel>)
    : calculateOutputPrice(value as Required<SwapFormModel>);

  return (
    <>
      {reversedRatio ? (
        <>
          1 <Truncate>{value.toAsset?.ticker}</Truncate> ={' '}
          {`${price?.toString()}`}{' '}
          <Truncate>{price?.baseAsset.ticker}</Truncate>
        </>
      ) : (
        <>
          1 <Truncate>{value.fromAsset?.ticker}</Truncate> ={' '}
          {`${price?.toString()}`}{' '}
          <Truncate>{price?.baseAsset.ticker}</Truncate>
        </>
      )}
    </>
  );
};

const _RatioView: FC<RatioViewProps> = ({ value, className }) => {
  const [reversedRatio, setReversedRatio] = useState(false);

  const toggleReversedRatio = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    setReversedRatio((reversedRatio) => !reversedRatio);
  };

  return (
    <Typography.Body className={className} onClick={toggleReversedRatio}>
      <RatioString value={value} reversedRatio={reversedRatio} />
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
