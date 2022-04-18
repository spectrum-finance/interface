import { t } from '@lingui/macro';
import React from 'react';

import { Tag } from '../../../../../ergodex-cdk';
import { OperationType } from '../../../../common/TxHistory/types';

interface TxTypeTagProps {
  type: OperationType;
}

const getType = (type: OperationType): { text: string; color: string } => {
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

const TypeTag: React.FC<TxTypeTagProps> = ({ type }) => {
  const { text, color } = getType(type);
  return <Tag color={color}>{text}</Tag>;
};

export { TypeTag };
