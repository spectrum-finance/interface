import React from 'react';
import { Table } from '@geist-ui/react';
import { renderFractions } from '../../utils/math';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ERG_TOKEN_NAME, ERG_DECIMALS } from '../../constants/erg';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk';

interface Props {
  minerFee: string;
  uiFee: bigint;
  swapExtremums: SwapExtremums;
}

export const SwapSummary: React.FC<Props> = ({
  minerFee,
  uiFee,
  swapExtremums: { maxExFee, minExFee, minOutput, maxOutput },
}) => {
  const minExFeeRendered = renderFractions(minExFee, ERG_DECIMALS);
  const maxExFeeRendered = renderFractions(maxExFee, ERG_DECIMALS);
  const minOutputRendered = renderFractions(
    minOutput.amount,
    minOutput.asset.decimals,
  );
  const maxOutputRendered = renderFractions(
    maxOutput.amount,
    maxOutput.asset.decimals,
  );
  return (
    <Table
      data={[
        {
          prop: 'Miner fee',
          value: `${minerFee} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Execution fee',
          value: `${minExFeeRendered} - ${maxExFeeRendered} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'UI fee',
          value: `${renderFractions(uiFee, ERG_DECIMALS)} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Output',
          value: `${minOutputRendered} - ${maxOutputRendered} ${minOutput.asset.name}`,
        },
      ]}
    >
      <Table.Column prop="prop" label="Detail" />
      <Table.Column prop="value" label="Amount" />
    </Table>
  );
};
