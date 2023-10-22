import { Button, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import { FC, useEffect } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { networkAssetBalance$ } from '../../../../../../gateway/api/networkAssetBalance';
import { selectedWallet$ } from '../../../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../../../gateway/common/network';
import { settings$ } from '../../../../../../gateway/settings/settings';
import {
  useHasActiveAdaHandleOnBalance,
  useHasAdaHandle,
} from '../../../../../../network/cardano/api/adaHandle';
import {
  patchSettings as patchCardanoSettings,
  useSettings as useCardanoSettings,
} from '../../../../../../network/cardano/settings/settings';
import { openAdaHandleModal } from '../../../../../../network/cardano/widgets/AdaHandle/AdaHandleModal/AdaHandleModal';
import { isCardano } from '../../../../../../utils/network';
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
  const [hasAdaHandleBalance] = useHasAdaHandle();
  const [hasActiveAdaHandleOnBalance] = useHasActiveAdaHandleOnBalance();
  const { wasAdaHandleModalOpened } = useCardanoSettings();

  useEffect(() => {
    if (!isCardano() || !hasAdaHandleBalance) {
      return;
    }
    if (
      hasAdaHandleBalance &&
      !hasActiveAdaHandleOnBalance &&
      !wasAdaHandleModalOpened &&
      networkAssetBalance !== undefined
    ) {
      openAdaHandleModal(true);
    }
    if (networkAssetBalance !== undefined && !wasAdaHandleModalOpened) {
      patchCardanoSettings({ wasAdaHandleModalOpened: true });
    }
  }, [
    hasAdaHandleBalance,
    hasActiveAdaHandleOnBalance,
    wasAdaHandleModalOpened,
    networkAssetBalance,
  ]);

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
  border: none;
  background: var(--spectrum-connect-wallet-address-btn-bg);
  color: var(--spectrum-connect-wallet-address-btn-color);

  &:hover {
    border: none;
    background: var(--spectrum-connect-wallet-address-btn-bg);
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &:active,
  &:focus {
    border: none;
    background: var(--spectrum-connect-wallet-address-btn-bg);
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &.ant-btn-loading {
    border: none;
  }
`;
