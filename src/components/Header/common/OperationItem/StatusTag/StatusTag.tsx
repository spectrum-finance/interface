import { Tag } from '@ergolabs/ui-kit';
import React from 'react';

import { OperationStatus } from '../../../../common/TxHistory/types';

interface TxStatusTagProps {
  status: OperationStatus;
}

const getStatus = (type: OperationStatus): { text: string; color: string } => {
  switch (type) {
    case 'executed':
      return { text: 'Done', color: 'success' };
    default:
      return { text: 'Pending', color: 'blue' };
  }
};

const StatusTag: React.FC<TxStatusTagProps> = ({ status }) => {
  const { text, color } = getStatus(status);

  return <Tag color={color}>{text}</Tag>;
};

export { StatusTag };
