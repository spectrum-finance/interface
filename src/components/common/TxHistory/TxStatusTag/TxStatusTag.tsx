import { Tag } from '@ergolabs/ui-kit';
import React from 'react';

import { OperationStatus } from '../types';

interface TxStatusTagProps {
  status: OperationStatus;
}

const getTxStatus = (
  type: OperationStatus,
): { text: string; color: string } => {
  switch (type) {
    case 'executed':
      return { text: 'Done', color: 'success' };
    default:
      return { text: 'Pending', color: 'blue' };
  }
};

const TxStatusTag: React.FC<TxStatusTagProps> = ({ status }) => {
  const { text, color } = getTxStatus(status);

  return <Tag color={color}>{text}</Tag>;
};

export { TxStatusTag };
