import {
  Box,
  Button,
  ButtonProps,
  Control,
  Flex,
  Input,
  SwapOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Ratio } from '../../../../common/models/Ratio';
import { normalizeAmount } from '../../../../common/utils/amount';
import { escapeRegExp } from '../../../../components/common/TokenControl/AssetAmountInput/format';

const _SwitchButton: FC<ButtonProps> = ({ ...rest }) => (
  <Button {...rest} type="primary">
    <SwapOutlined />
  </Button>
);

const SwitchButton = styled(_SwitchButton)`
  padding: 0;
  width: 2rem;
`;

export interface InitialPrice extends Control<Ratio | undefined> {
  readonly xAsset?: AssetInfo;
  readonly yAsset?: AssetInfo;
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const _normalizeAmount = (amount: string, asset: AssetInfo): string =>
  Math.floor(Number(amount)) > 0 ? normalizeAmount(amount, asset) : amount;

const getRelevantDecimalsCount = (amount: string, asset: AssetInfo): number => {
  const numberAmount = Math.floor(Number(amount));

  if (numberAmount > 0) {
    return asset.decimals || 0;
  }

  const decimalsPart = amount.split('.')[1] || '';
  const count =
    decimalsPart.split('').findIndex((symbol) => Number(symbol) > 0) + 1 ||
    decimalsPart.length ||
    (!numberAmount ? 1 : 0);

  return Math.max(count, asset.decimals || 0);
};

const isValidAmount = (
  value: string,
  asset: AssetInfo | undefined,
): boolean => {
  if (!asset) {
    return true;
  }
  const decimalsCount = getRelevantDecimalsCount(value, asset);

  if (!decimalsCount && value.indexOf('.') !== -1) {
    return false;
  }
  return (value.split('.')[1]?.length || 0) <= decimalsCount;
};

export const InitialPriceInput: FC<InitialPrice> = ({
  xAsset,
  yAsset,
  onChange,
  value,
}) => {
  const [userInput, setUserInput] = useState<string | undefined>(undefined);
  const [baseAssetSign, setBaseAssetSign] = useState<'x' | 'y'>('x');

  let baseAsset: AssetInfo | undefined = undefined;
  let quoteAsset: AssetInfo | undefined = undefined;

  if (xAsset && yAsset) {
    baseAsset = baseAssetSign === 'x' ? xAsset : yAsset;
    quoteAsset = baseAssetSign === 'y' ? xAsset : yAsset;
  }

  useEffect(() => {
    if (!value || !xAsset || !userInput) {
      return;
    }

    const newRatio =
      baseAssetSign === 'y'
        ? new Ratio(value.toAmount(), value.baseAsset, xAsset)
        : new Ratio(
            _normalizeAmount(userInput, xAsset),
            xAsset,
            value.quoteAsset,
          );

    setUserInput(newRatio.toAmount());
    onChange && onChange(newRatio);
  }, [xAsset?.id]);

  useEffect(() => {
    if (!value || !yAsset || !userInput) {
      return;
    }

    const newRatio =
      baseAssetSign === 'x'
        ? new Ratio(value.toAmount(), value.baseAsset, yAsset)
        : new Ratio(
            _normalizeAmount(userInput, yAsset),
            yAsset,
            value.quoteAsset,
          );

    setUserInput(newRatio.toAmount());
    onChange && onChange(newRatio);
  }, [yAsset?.id]);

  const handleBaseAssetChange = () => {
    if (!yAsset || !xAsset) {
      return;
    }

    const newBaseAsset = baseAssetSign === 'x' ? yAsset : xAsset;
    const newQuoteAsset = baseAssetSign === 'x' ? xAsset : yAsset;

    const newRatio: Ratio | undefined = userInput
      ? new Ratio(
          _normalizeAmount(userInput, newBaseAsset),
          newBaseAsset,
          newQuoteAsset,
        )
      : undefined;

    setBaseAssetSign((prev) => (prev === 'x' ? 'y' : 'x'));
    if (newRatio) {
      setUserInput(newRatio.toAmount());
      onChange && onChange(newRatio);
    }
  };

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput.startsWith('.')) {
      nextUserInput = nextUserInput.replace('.', '0.');
    }
    if (!baseAsset || !quoteAsset) {
      setUserInput(nextUserInput);
      return;
    }
    if (nextUserInput === '' && onChange) {
      setUserInput('');
      onChange(undefined);
      return;
    }
    if (
      inputRegex.test(escapeRegExp(nextUserInput)) &&
      onChange &&
      isValidAmount(nextUserInput, baseAsset)
    ) {
      setUserInput(nextUserInput);
      onChange(new Ratio(nextUserInput, baseAsset, quoteAsset));
      return;
    }
    setUserInput(userInput ?? '');
  };

  return (
    <Box control padding={1}>
      <Flex align="center">
        <Flex.Item marginRight={2} flex={1}>
          <Input
            value={userInput}
            onChange={(event) => {
              enforcer(event.target.value.replace(/,/g, '.'));
            }}
            textAlign="right"
            suffix={
              baseAsset && quoteAsset ? (
                <Typography.Body>
                  {baseAsset.name} per {quoteAsset.name}
                </Typography.Body>
              ) : (
                ' '
              )
            }
          />
        </Flex.Item>
        <SwitchButton onClick={handleBaseAssetChange} />
      </Flex>
    </Box>
  );
};
