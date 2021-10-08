import './ConnectWallet.less';

import { Button } from 'antd';
import React from 'react';

interface ConnectWalletProps {
  type:
    | 'default'
    | 'balance-only'
    | 'address-only'
    | 'pending'
    | 'pending-text'
    | 'pending-icon';
  balance?: string;
  address?: string;
}

const getShortAddress = (address?: string) => {
  let shortAddress = address ? address : '';
  shortAddress =
    shortAddress.length < 10
      ? shortAddress
      : shortAddress.substring(0, 6) +
        '...' +
        shortAddress.substring(shortAddress.length - 4, shortAddress.length);

  return shortAddress;
};

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  type,
  balance,
  address,
}) => {
  const showBalance =
    type === 'default' || type === 'balance-only' || type === 'pending';

  const pending =
    type === 'pending' || type === 'pending-text' || type === 'pending-icon';

  const shortAddress = getShortAddress(address);

  return (
    <div className="connect-wallet__wrapper">
      {showBalance && (
        <span
          className={`connect-wallet__balance-label connect-wallet__${type}`}
        >
          {balance}
        </span>
      )}
      {type !== 'balance-only' && (
        <Button
          className={`connect-wallet__address-label connect-wallet__${type}`}
          loading={pending}
        >
          {type === 'pending-icon' ? '' : pending ? `1 Pending` : shortAddress}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
