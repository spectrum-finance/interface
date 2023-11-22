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

  const formatAmountAda = (value: number) => {
    const formated = `${Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}₳`;
    return formated;
  };

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
    <>
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
                <p className="balance-wallet">
                  {formatAmountAda(
                    Number(networkAssetBalance.amount) / 1000000,
                  )}
                </p>
              </Flex.Item>
            </>
          )}

          <AddressTag
            loading={networkAssetBalance === undefined}
            address={settings?.address}
          />
        </Flex>
      </Button>
    </>
  );
};

export const WalletInfoButton = styled(_WalletInfoButton)`
  height: 40px;
  padding: 4px;
  border: none;
  background: var(--teddy-box-color);
  color: var(--spectrum-connect-wallet-address-btn-color);

  &:hover {
    border: none;
    background: var(--teddy-primary-color-hover);
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &:active {
    border: none;
    color: var(--spectrum-connect-wallet-address-btn-color);
  }

  &.ant-btn-loading {
    border: none;
  }
  .balance-wallet {
    margin: 0;
    padding-inline: 5px;
  }
`;
