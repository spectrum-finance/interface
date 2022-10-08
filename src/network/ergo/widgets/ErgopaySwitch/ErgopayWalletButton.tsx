import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import {
  hasReadonlyAddress,
  ReadonlyWallet,
  setReadonlyAddress,
} from '../../api/wallet/readonly/readonly';
import { connectWallet } from '../../api/wallet/wallet';
import { patchSettings } from '../../settings/settings';
import { ErgopaySettingsModal } from './ErgopaySettingsModal/ErgopaySettingsModal';

const StyledButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--spectrum-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--spectrum-default-border-color) !important;
    }
  }
`;

export const ErgopayWalletButton: FC<{ close: () => void }> = ({ close }) => {
  const prepareWalletAndEnableErgopay = () => {
    if (!hasReadonlyAddress()) {
      Modal.open(({ close }) => (
        <ErgopaySettingsModal
          close={(address) => {
            close();
            if (address) {
              setReadonlyAddress(address);
              patchSettings({ ergopay: true });
              connectWallet(ReadonlyWallet).subscribe(() => {});
            }
          }}
        />
      ));
    } else {
      patchSettings({ ergopay: true });
      connectWallet(ReadonlyWallet).subscribe(() => {});
    }
    close();
  };

  return (
    <StyledButton onClick={prepareWalletAndEnableErgopay}>
      <Flex.Item flex={1} display="flex" align="center">
        ErgoPay
      </Flex.Item>
      <AssetIcon asset={networkAsset} size="large" />
    </StyledButton>
  );
};
