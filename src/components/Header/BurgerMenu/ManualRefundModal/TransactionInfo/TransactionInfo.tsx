import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import React, { FC } from 'react';

import { Flex } from '../../../../../ergodex-cdk';
import { OperationItemView } from '../../../common/OperationItem/OperationItemView';

export interface TransactionInfoProps {
  operation: AmmDexOperation;
}

export const TransactionInfo: FC<TransactionInfoProps> = ({ operation }) => (
  <Flex>
    <OperationItemView operation={operation} />
  </Flex>
);
