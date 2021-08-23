import React from 'react';
import { Table } from '@geist-ui/react';
import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  totalFee: string;
}

export const PoolSummary: React.FC<Props> = ({ totalFee }) => {
  return (
    <Table
      data={[
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
