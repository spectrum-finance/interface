import { Modal, Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback } from 'react';
import { isMobile } from 'react-device-detect';

import {
  hasReadonlyAddress,
  ReadonlyWallet,
  setReadonlyAddress,
} from '../../api/wallet/readonly/readonly';
import { connectWallet, disconnectWallet } from '../../api/wallet/wallet';
import { patchSettings, useSettings } from '../../settings/settings';
import { ErgopaySettingsModal } from './ErgopaySettingsModal/ErgopaySettingsModal';

const ErgopaySwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [{ ergopay }] = useSettings();

  const prepareWalletAndEnableErgopay = () => {
    if (isMobile) {
      disconnectWallet();
      patchSettings({ ergopay: true });
    } else if (!hasReadonlyAddress()) {
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
  };

  const handleChangeErgopay = useCallback(
    (ergoPay) => {
      if (ergoPay) {
        prepareWalletAndEnableErgopay();
      } else {
        disconnectWallet();
        patchSettings({ ergopay: false });
      }
    },
    [ergopay],
  );

  return (
    <Switch checked={ergopay} size="small" onChange={handleChangeErgopay} />
  );
};

export { ErgopaySwitch };
