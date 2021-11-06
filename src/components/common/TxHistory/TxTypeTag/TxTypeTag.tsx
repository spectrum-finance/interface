import React from 'react';

import { Tag } from '../../../../ergodex-cdk';
import { OperationType } from '../types';

interface TxTypeTagProps {
  type: OperationType;
}

const getTxType = (type: OperationType): { text: string; color: string } => {
  switch (type) {
    case 'swap':
      return { text: 'Swap', color: 'magenta' };
    case 'deposit':
      return { text: 'Add liquidity', color: 'geekblue' };
    case 'redeem':
      return { text: 'Remove liquidity', color: 'default' };
    case 'refund':
      return { text: 'Refund', color: 'orange' };
  }
};

const TxTypeTag: React.FC<TxTypeTagProps> = ({ type }) => {
  const { text, color } = getTxType(type);
  return <Tag color={color}>{text}</Tag>;
};

export { TxTypeTag };
