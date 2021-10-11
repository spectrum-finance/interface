import React from 'react';
import { Table } from '@geist-ui/react';
import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  minerFee: string;
  exFee: string;
  uiFee: string;
  totalFee: string;
  lpTokensAmount: string;
}

export const DepositSummary: React.FC<Props> = ({
  minerFee,
  exFee,
  uiFee,
  totalFee,
  lpTokensAmount,
}) => {
  return (
    <Table
      data={[
        {
          prop: 'LP tokens',
          value: lpTokensAmount,
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
