import './ConnectWallet.less';

import React, { useState } from 'react';

import { ChooseWalletModal } from '../ChooseWalletModal/ChooseWalletModal';
import { Button } from '../index';

export interface ConnectWalletProps {
  type:
    | 'default'
    | 'connected'
    | 'balance-only'
    | 'address-only'
    | 'pending'
    | 'pending-text'
    | 'pending-icon';
  balance?: number;
  currency?: string;
  address?: string;
  numberOfPendingTxs?: number;
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

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  type,
  balance,
  currency,
  address,
  numberOfPendingTxs,
}) => {
  const [isChooseWalletModalOpen, setIsChooseWalletModalOpen] =
    useState<boolean>(false);

  const showBalance =
    type === 'connected' || type === 'balance-only' || type === 'pending';

  const pending =
    type === 'pending' || type === 'pending-text' || type === 'pending-icon';

  const shortAddress = getShortAddress(address);

  const defaultButton = (
    <Button
      className="connect-wallet__default-btn"
      onClick={() => setIsChooseWalletModalOpen(true)}
    >
      Connect to wallet
    </Button>
  );

  const commonButtons = (
    <div className="connect-wallet__common-btn_wrapper">
      {showBalance && (
        <span
          className={`connect-wallet__common-btn_balance-label connect-wallet__common-btn_${type}`}
        >
          {`${balance} ${currency}`}
        </span>
      )}
      {type !== 'balance-only' && (
        <Button
          className={`connect-wallet__common-btn_address-label connect-wallet__common-btn_${type}`}
          loading={pending}
        >
          {type === 'pending-icon'
            ? ''
            : pending
            ? `${numberOfPendingTxs} Pending`
            : shortAddress}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {type === 'default' ? defaultButton : commonButtons}
      <ChooseWalletModal
        isOpen={isChooseWalletModalOpen}
        onCancel={() => setIsChooseWalletModalOpen(false)}
      />
    </>
  );
};
