/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { swapVars } from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import React, { FC, useEffect } from 'react';
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

import { TokenControlValue } from '../../components/common/TokenControl/TokenControl';
import { InfoTooltip } from '../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, MIN_EX_FEE, UI_FEE } from '../../constants/erg';
import { defaultExFee } from '../../constants/settings';
import { useSettings } from '../../context';
import { Flex, FormInstance, Typography } from '../../ergodex-cdk';
import { useObservableAction } from '../../hooks/useObservable';
import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';
import { getBaseInputParameters } from '../../utils/walletMath';
import { renderPrice } from './Ratio';

interface SwapFormModel {
  readonly from?: TokenControlValue;
  readonly to?: TokenControlValue;
  readonly pool?: AmmPool;
}

const TxInfoTooltipContent: FC<{ form: FormInstance<SwapFormModel> }> = ({
  form,
}) => {
  const { from, pool } = form.getFieldsValue();
  const [{ slippage, minerFee, nitro }] = useSettings();
  const swapExtremums = swapVars(
    MIN_EX_FEE,
    nitro,
    getBaseInputParameters(pool!, {
      inputAmount: from?.amount?.value?.toString()!,
      inputAsset: from?.asset!,
      slippage,
    }).minOutput,
  );

  const output = swapExtremums
    ? `${renderFractions(
        swapExtremums[1].minOutput.amount,
        swapExtremums[1].minOutput.asset.decimals,
      )} ${swapExtremums[1].minOutput.asset.name} - ${renderFractions(
        swapExtremums[1].maxOutput.amount,
        swapExtremums[1].maxOutput.asset.decimals,
      )} ${swapExtremums[1].minOutput.asset.name}`
    : undefined;

  const totalFees = calculateTotalFee(
    [minerFee, UI_FEE, defaultExFee],
    ERG_DECIMALS,
  );

  return (
    <Flex flexDirection="col">
      <Flex.Item marginBottom={3}>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Output</Flex.Item>
          {output}
        </Flex>
      </Flex.Item>
      <Flex.Item marginBottom={3}>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Slippage tolerance</Flex.Item>
          {slippage}%
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Flex justify="space-between">
          <Flex.Item marginRight={6}>Total Fees</Flex.Item>
          {totalFees} ERG
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

const calculateInfo = (form: FormInstance<SwapFormModel>) =>
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
      return form;
    }),
  );

export const SwapTooltip = ({ form }: { form: FormInstance }) => {
  const [f, updateF] = useObservableAction(calculateInfo, form);

  useEffect(() => {
    updateF(form);
  }, [form, updateF]);

  return (
    <InfoTooltip
      className="swap-tooltip"
      content={<TxInfoTooltipContent form={f} />}
      placement="left"
    />
  );
};
