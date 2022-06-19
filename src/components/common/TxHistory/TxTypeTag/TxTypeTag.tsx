import { Tag } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React from 'react';

import { OperationType } from '../types';

interface TxTypeTagProps {
  type: OperationType;
}

const getTxType = (type: OperationType): { text: string; color: string } => {
  switch (type) {
    case 'swap':
      return { text: t`Swap`, color: 'magenta' };
    case 'deposit':
      return { text: t`Add liquidity`, color: 'geekblue' };
    case 'redeem':
      return { text: t`Remove liquidity`, color: 'default' };
    case 'refund':
      return { text: t`Refund`, color: 'orange' };
  }
};

const TxTypeTag: React.FC<TxTypeTagProps> = ({ type }) => {
  const { text, color } = getTxType(type);
  return <Tag color={color}>{text}</Tag>;
};

export { TxTypeTag };
