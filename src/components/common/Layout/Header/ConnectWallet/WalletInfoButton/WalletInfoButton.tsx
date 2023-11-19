import { Button, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { useAssetMode } from '../../../../../../context/AssetModeContext';
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
import useFetch from '../../../../../../pages/LBE/DepositBox/useAdaPrice';
import { isCardano } from '../../../../../../utils/network';
import { WalletModal } from '../../../../../WalletModal/WalletModal';
import { AddressTag } from './AddressTag/AddressTag';
import styles from './WalletInfoButton.module.less';
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

  const { assetMode, setAssetMode } = useAssetMode();
  const [balance, setBalance] = useState<string>('');
  const { data, loading } = useFetch('/api/adaprice');

  const formatAmountAda = (value: number) => {
    const formated = `${Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}₳`;
    return formated;
  };

  const formatAmountUsd = (value: number) => {
    const formated = `~$${Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}`;
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

  useEffect(() => {
    if (networkAssetBalance !== undefined) {
      if (assetMode === 'USD') {
        loading
          ? setBalance('Loading...')
          : setBalance(
              formatAmountUsd(
                (Number(data) * Number(networkAssetBalance.amount)) / 1000000,
              ),
            );
      } else {
        setBalance(
          formatAmountAda(Number(networkAssetBalance.amount) / 1000000),
        );
      }
    }
  }, [networkAssetBalance, assetMode, data]);

  return (
    <>
      {!s && (
        <div className={styles.toogleAssets}>
          <p
            className={`${styles.asset} ${
              assetMode === 'USD' ? styles.active : ''
            }`}
            onClick={() => setAssetMode('USD')}
          >
            USD
          </p>
          <p
            className={`${styles.asset} ${
              assetMode === 'ADA' ? styles.active : ''
            }`}
            onClick={() => setAssetMode('ADA')}
          >
            ADA
          </p>
        </div>
      )}

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
                <p className="balance-wallet">{balance}</p>
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
