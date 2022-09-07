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
import { networkAssetBalance$ } from '../../../../../../gateway/api/networkAssetBalance';
import { pendingOperations$ } from '../../../../../../gateway/api/pendingOperations';
import { settings$ } from '../../../../../../gateway/settings/settings';
import { WalletModal } from '../../../../../WalletModal/WalletModal';
import { AddressOrPendingTag } from './AddressOrPendingTag/AddressOrPendingTag';
import { BalanceView } from './BalanceView/BalanceView';

export interface WalletInfoButtonProps {
  className?: string;
}

const _WalletInfoButton: FC<WalletInfoButtonProps> = ({ className }) => {
  const [networkAssetBalance] = useObservable(networkAssetBalance$);
  const [settings] = useObservable(settings$);
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
      {networkAssetBalance !== undefined ? (
        <Flex align="center" stretch>
          {!s && (
            <>
              <Flex.Item marginLeft={1} marginRight={2}>
                <BalanceView balance={networkAssetBalance} />
              </Flex.Item>
            </>
          )}
          <AddressOrPendingTag
            address={settings?.address}
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
