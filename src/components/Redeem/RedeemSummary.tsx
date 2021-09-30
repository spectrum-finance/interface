import { Table } from '@geist-ui/react';
import React from 'react';

import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  minerFee: string;
  dexFee: string;
  totalFee: string;
  outputAssetXName: string;
  outputAssetYName: string;
  outputAssetXAmount: string;
  outputAssetYAmount: string;
}

export const RedeemSummary: React.FC<Props> = ({
  minerFee,
  dexFee,
  totalFee,
  outputAssetXName,
  outputAssetYName,
  outputAssetXAmount,
  outputAssetYAmount,
}) => {
  return (
    <Table
      data={[
        {
          prop: 'Output 1',
          value: `${outputAssetXAmount} ${outputAssetXName}`,
        },
        {
          prop: 'Output 2',
          value: `${outputAssetYAmount} ${outputAssetYName}`,
        },
        {
          prop: 'Miner fee',
          value: `${minerFee} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'DEX fee',
          value: `${dexFee} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'Total fee',
          value: `${totalFee} ${ERG_TOKEN_NAME}`,
        },
      ]}
    >
      <Table.Column prop="prop" label="Detail" />
      <Table.Column prop="value" label="Amount" />
    </Table>
  );
};
