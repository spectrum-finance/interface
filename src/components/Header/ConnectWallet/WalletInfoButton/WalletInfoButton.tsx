import { LoadingOutlined } from '@ant-design/icons';
import { Address } from '@ergolabs/ergo-sdk';
import { Button, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../common/models/Currency';
import { useDevice } from '../../../../hooks/useDevice';
import { WalletModal } from '../../../WalletModal/WalletModal';
import { AddressTag } from './AddressTag/AddressTag';

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
  const { s } = useDevice();

  return (
    <Button className={className} onClick={openWalletModal} size="large">
      {balance !== undefined ? (
        <Flex align="center" stretch>
          {!s && (
            <Flex.Item marginRight={2} marginLeft={1}>
              <Typography.Body
                style={{ whiteSpace: 'nowrap', fontSize: '16px' }}
              >
                {balance?.toCurrencyString()}
              </Typography.Body>
            </Flex.Item>
          )}
          <AddressTag address={address} />
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
