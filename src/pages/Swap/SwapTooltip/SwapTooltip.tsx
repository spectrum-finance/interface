/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { swapVars } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../../context';
import { Flex } from '../../../ergodex-cdk';
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useMaxTotalFees, useMinExFee } from '../../../services/new/core';
import { renderFractions } from '../../../utils/math';
import { getBaseInputParameters } from '../../../utils/walletMath';
import { SwapFormModel } from '../SwapFormModel';

const TxInfoTooltipContent: FC<{ value: SwapFormModel }> = ({ value }) => {
  const [{ slippage, nitro }] = useSettings();
  const totalFees = useMaxTotalFees();
  const minExFee = useMinExFee();

  const swapExtremums =
    value.fromAmount?.isPositive() && value.toAmount?.isPositive() && value.pool
      ? swapVars(
          minExFee.amount,
          nitro,
          getBaseInputParameters(value.pool['pool']!, {
            inputAmount: value.fromAmount?.toAmount()!,
            inputAsset: value.fromAsset!,
            slippage,
          }).minOutput,
        )
      : undefined;

  const output = swapExtremums
    ? `${renderFractions(
        swapExtremums[1].minOutput.amount,
        swapExtremums[1].minOutput.asset.decimals,
      )} - ${renderFractions(
        swapExtremums[1].maxOutput.amount,
        swapExtremums[1].maxOutput.asset.decimals,
      )} ${swapExtremums[1].minOutput.asset.name}`
    : undefined;

  return (
    <Flex direction="col">
      <Flex.Item marginBottom={3}>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Output:</Flex.Item>
          {output}
        </Flex>
      </Flex.Item>
      <Flex.Item marginBottom={3}>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Slippage tolerance:</Flex.Item>
          {slippage}%
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Total Fees:</Flex.Item>
          {totalFees.toCurrencyString()}
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export const SwapTooltip = ({
  form,
}: {
  form: FormGroup<SwapFormModel>;
}): JSX.Element => {
  const [value] = useObservable(
    form.valueChangesWithSilent$,
    [form],
    form.value,
  );

  return value.pool &&
    value.toAsset &&
    value.toAmount?.isPositive() &&
    value.fromAsset &&
    value.fromAmount?.isPositive() ? (
    <InfoTooltip
      className="swap-tooltip"
      content={<TxInfoTooltipContent value={value} />}
      placement="left"
    />
  ) : (
    <></>
  );
};
