import React from 'react';
import { Table } from '@geist-ui/react';
import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  minerFee: string;
  dexFee: string;
  totalFee: string;
  lpTokensAmount: string;
}

export const DepositSummary: React.FC<Props> = ({
  minerFee,
  dexFee,
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
