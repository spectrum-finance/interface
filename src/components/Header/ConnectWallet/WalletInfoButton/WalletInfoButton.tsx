import { LoadingOutlined } from '@ant-design/icons';
import { Address } from '@ergolabs/ergo-sdk';
import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { pendingTransactions$ } from '../../../../network/ergo/api/transactionHistory/pendingTransactions';
import { WalletModal } from '../../../WalletModal/WalletModal';
import { AddressOrPendingTag } from './AddressOrPendingTag/AddressOrPendingTag';
import { BalanceView } from './BalanceView/BalanceView';

export interface WalletInfoButtonProps {
  className?: string;
  address?: Address;
  balance?: Currency;
}

const _WalletInfoButton: FC<WalletInfoButtonProps> = ({
  className,
  balance,
  address,
}) => {
  const openWalletModal = () => Modal.open(<WalletModal />);
  const [pendingCount] = useObservable(pendingTransactions$);

  return (
    <Button className={className} onClick={openWalletModal} size="large">
      {balance !== undefined && pendingCount !== undefined ? (
        <Flex align="center" stretch>
          <Flex.Item marginLeft={1} marginRight={2}>
            <BalanceView balance={balance} />
          </Flex.Item>
          <AddressOrPendingTag
            address={address}
            pendingCount={pendingCount.length}
          />
        </Flex>
      ) : (
        <LoadingOutlined />
      )}
    </Button>
  );
};

export const WalletInfoButton = styled(_WalletInfoButton)`
  height: 40px;
  padding: 4px 8px;
  border: 1px solid var(--ergo-box-border-color);
  background: var(--ergo-connect-wallet-address-btn-bg);
  color: var(--ergo-connect-wallet-address-btn-color);

  &:hover {
    border: 1px solid var(--ergo-box-border-color);
    background: var(--ergo-connect-wallet-address-btn-bg);
    color: var(--ergo-connect-wallet-address-btn-color);
  }

  &:active,
  &:focus {
    border: 1px solid var(--ergo-box-border-color);
    background: var(--ergo-connect-wallet-address-btn-bg);
    color: var(--ergo-connect-wallet-address-btn-color);
  }

  &.ant-btn-loading {
    border: 1px solid var(--ergo-box-border-color);
  }
`;
