import React from 'react';
import { Grid, Table } from '@geist-ui/react';
import { ERG_TOKEN_NAME } from '../../constants/erg';

interface Props {
  minerFee: string;
  dexFee: string;
}

export const DepositSummary: React.FC<Props> = ({ minerFee, dexFee }) => {
  return (
    <Grid xs={24}>
      <Table
        data={[
          {
            prop: 'Miner fee',
            value: `${minerFee} ${ERG_TOKEN_NAME}`,
          },
          {
            prop: 'DEX fee',
            value: `${dexFee} ${ERG_TOKEN_NAME}`,
          },
        ]}
      >
        <Table.Column prop="prop" label="Detail" />
        <Table.Column prop="value" label="Amount" />
      </Table>
    </Grid>
  );
};
