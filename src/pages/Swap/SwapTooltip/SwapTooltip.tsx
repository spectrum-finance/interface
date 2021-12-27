/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { swapVars } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import React, { FC } from 'react';

import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, MIN_EX_FEE } from '../../../constants/erg';
import { defaultExFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import { Flex } from '../../../ergodex-cdk';
import { FormGroup } from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable } from '../../../hooks/useObservable';
import { renderFractions } from '../../../utils/math';
import { calculateTotalFee } from '../../../utils/transactions';
import { getBaseInputParameters } from '../../../utils/walletMath';
import { SwapFormModel } from '../SwapModel';

const TxInfoTooltipContent: FC<{ value: SwapFormModel }> = ({ value }) => {
  const [{ slippage, minerFee, nitro }] = useSettings();

  const swapExtremums =
    value.fromAmount?.value &&
    value.fromAsset &&
    value.toAmount?.value &&
    value.toAsset &&
    value.pool
      ? swapVars(
          MIN_EX_FEE,
          nitro,
          getBaseInputParameters(value.pool!, {
            inputAmount: value.fromAmount?.value?.toString()!,
            inputAsset: value.fromAsset!,
            slippage,
          }).minOutput,
        )
      : undefined;

  const output = swapExtremums
    ? `${renderFractions(
        swapExtremums[1].minOutput.amount,
        swapExtremums[1].minOutput.asset.decimals,
      )} ${swapExtremums[1].minOutput.asset.name} - ${renderFractions(
        swapExtremums[1].maxOutput.amount,
        swapExtremums[1].maxOutput.asset.decimals,
      )} ${swapExtremums[1].minOutput.asset.name}`
    : undefined;

  const totalFees = calculateTotalFee([minerFee, defaultExFee], ERG_DECIMALS);

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
          {totalFees} ERG
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
  const [value] = useObservable(form.valueChangesWithSilent$, {
    deps: [form],
    defaultValue: form.value,
  });

  return value.pool &&
    value.toAsset &&
    value.toAmount?.value &&
    value.fromAsset &&
    value.fromAmount?.value ? (
    <InfoTooltip
      className="swap-tooltip"
      content={<TxInfoTooltipContent value={value} />}
      placement="left"
    />
  ) : (
    <></>
  );
};
