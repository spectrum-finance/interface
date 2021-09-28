import React from 'react';
import { Table } from '@geist-ui/react';
import { renderFractions } from '../../utils/math';
import { ERG_TOKEN_NAME, ERG_DECIMALS, UI_FEE } from '../../constants/erg';
import { SwapExtremums } from '@ergolabs/ergo-dex-sdk';

interface Props {
  minerFee: string;
  swapExremums: SwapExtremums;
}

export const SwapSummary: React.FC<Props> = ({
  minerFee,
  swapExremums: { maxExFee, minExFee, minOutput, maxOutput },
}) => {
  return (
    <Table
      data={[
        {
          prop: 'Miner fee',
          value: `${minerFee} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Min DEX fee',
          value: `${renderFractions(minExFee, ERG_DECIMALS)} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Max DEX fee',
          value: `${renderFractions(maxExFee, ERG_DECIMALS)} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'UI fee',
          value: `${renderFractions(UI_FEE, ERG_DECIMALS)} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Min output',
          value: `${renderFractions(
            minOutput.amount,
            minOutput.asset.decimals,
          )} ${minOutput.asset.name}`,
        },
        {
          prop: 'Max output',
          value: `${renderFractions(
            maxOutput.amount,
            maxOutput.asset.decimals,
          )} ${maxOutput.asset.name}`,
        },
      ]}
    >
      <Table.Column prop="prop" label="Detail" />
      <Table.Column prop="value" label="Amount" />
    </Table>
  );
};
