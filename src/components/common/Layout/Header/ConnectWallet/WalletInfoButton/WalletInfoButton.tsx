import { Button, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import React, { FC } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { networkAssetBalance$ } from '../../../../../../gateway/api/networkAssetBalance';
import { selectedWallet$ } from '../../../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../../../gateway/common/network';
import { settings$ } from '../../../../../../gateway/settings/settings';
import { WalletModal } from '../../../../../WalletModal/WalletModal';
import { AddressTag } from './AddressTag/AddressTag';
import { BalanceView } from './BalanceView/BalanceView';

export interface WalletInfoButtonProps {
  className?: string;
}

const _WalletInfoButton: FC<WalletInfoButtonProps> = ({ className }) => {
  const [networkAssetBalance] = useObservable(networkAssetBalance$);
  const [settings] = useObservable(settings$);
  const openWalletModal = () =>
    Modal.open(({ close }) => <WalletModal close={close} />);
  const { s } = useDevice();

  const [selectedWallet] = useObservable(selectedWallet$);
  const [selectedNetwork] = useSelectedNetwork();

  return (
    <Button
      className={className}
      onClick={() => {
        openWalletModal();
        fireAnalyticsEvent('Open Connected Wallet Modal', {
          wallet_name: selectedWallet?.name || 'null',
          wallet_network: selectedNetwork.name,
        });
      }}
      size="large"
    >
      <Flex align="center" stretch>
        {!s && networkAssetBalance !== undefined && (
          <>
            <Flex.Item marginLeft={1} marginRight={2}>
              <BalanceView balance={networkAssetBalance} />
            </Flex.Item>
          </>
        )}
        <AddressTag
          loading={networkAssetBalance === undefined}
          address={settings?.address}
        />
      </Flex>
    </Button>
  );
};

export const WalletInfoButton = styled(_WalletInfoButton)`
  height: 40px;
  padding: 4px;
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
