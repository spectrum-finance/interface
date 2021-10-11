import React from 'react';
import { Table } from '@geist-ui/react';
import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  minerFee: string;
  exFee: string;
  uiFee: string;
  totalFee: string;
  outputAssetXName: string;
  outputAssetYName: string;
  outputAssetXAmount: string;
  outputAssetYAmount: string;
}

export const RedeemSummary: React.FC<Props> = ({
  minerFee,
  exFee,
  uiFee,
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
          prop: 'Execution fee',
          value: `${exFee} ${ERG_TOKEN_NAME}`,
        },
        {
          prop: 'UI fee',
          value: `${uiFee} ${ERG_TOKEN_NAME}`,
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
