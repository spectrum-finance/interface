import { Address } from '@ergolabs/ergo-sdk';
import {
  Button,
  Flex,
  LoadingOutlined,
  Modal,
  useDevice,
} from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { panalytics } from '../../../../../../common/analytics';
import { useObservable } from '../../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../../common/models/Currency';
import { pendingOperations$ } from '../../../../../../gateway/api/pendingOperations';
import { WalletModal } from '../../../../../WalletModal/WalletModal';
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
  const [pendingOperations] = useObservable(pendingOperations$);
  const { s } = useDevice();

  return (
    <Button
      className={className}
      onClick={() => {
        openWalletModal();
        panalytics.openWalletModal();
      }}
      size="large"
    >
      {balance !== undefined ? (
        <Flex align="center" stretch>
          {!s && (
            <>
              <Flex.Item marginLeft={1} marginRight={2}>
                <BalanceView balance={balance} />
              </Flex.Item>
            </>
          )}
          <AddressOrPendingTag
            address={address}
            pendingCount={pendingOperations?.length}
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
  border: 1px solid var(--spectrum-box-border-color);
  background: var(--spectrum-connect-wallet-address-btn-bg);
  color: var(--spectrum-connect-wallet-address-btn-color);

  &:hover {
    border: 1px solid var(--spectrum-box-border-color);
    background: var(--spectrum-connect-wallet-address-btn-bg);
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &:active,
  &:focus {
    border: 1px solid var(--spectrum-box-border-color);
    background: var(--spectrum-connect-wallet-address-btn-bg);
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &.ant-btn-loading {
    border: 1px solid var(--spectrum-box-border-color);
  }
`;
