import React from 'react';
import { Grid, Table } from '@geist-ui/react';
import { SwapExtremums } from 'ergo-dex-sdk/build/module/amm/math/swap';
import { renderFractions } from '../../utils/math';
import { ERG_TOKEN_NAME, ERG_DECIMALS } from '../../constants/erg';

interface Props {
  minerFee: string;
  swapExremums: SwapExtremums;
}

export const SwapSummary: React.FC<Props> = ({
  minerFee,
  swapExremums: { maxDexFee, minDexFee, minOutput, maxOutput },
}) => {
  return (
    <Grid xs={24}>
      <Table
        data={[
          {
            prop: 'Miner fee',
            value: `${minerFee} ${ERG_TOKEN_NAME}`,
          },
          {
            prop: 'Min DEX fee',
            value: `${renderFractions(
              BigInt(minDexFee),
              ERG_DECIMALS,
            )} ${ERG_TOKEN_NAME}`,
          },
          {
            prop: 'Max DEX fee',
            value: `${renderFractions(
              BigInt(maxDexFee),
              ERG_DECIMALS,
            )} ${ERG_TOKEN_NAME}`,
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
    </Grid>
  );
};
