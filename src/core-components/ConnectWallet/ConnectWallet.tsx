import './ConnectWallet.less';

import { Button } from 'antd';
import React from 'react';

interface ConnectWalletProps {
  type:
    | 'wallet-connected'
    | 'balance-only'
    | 'address-only'
    | 'pending'
    | 'pending-text'
    | 'pending-icon';
  status?: 'default' | 'hover' | 'pressed';
  balance?: number;
  address?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  type,
  status = 'default',
  balance,
  address,
}) => {
  const showBalance =
    type === 'wallet-connected' ||
    type === 'balance-only' ||
    type === 'pending';

  const pending =
    type === 'pending' || type === 'pending-text' || type === 'pending-icon';

  return (
    <div className={`wrapper ${status}`}>
      {showBalance && (
        <span className={`balance-label ${type}`}>{balance} ERG</span>
      )}
      {type !== 'balance-only' && (
        <Button className={`address-label ${type}`} loading={pending}>
          {type === 'pending-icon' ? '' : pending ? `1 Pending` : address}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
