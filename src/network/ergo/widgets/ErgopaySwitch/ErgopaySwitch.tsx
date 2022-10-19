import { Modal, Switch } from '@ergolabs/ui-kit';
import { SwitchProps } from 'antd';
import React, { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';

import {
  hasReadonlyAddress,
  ReadonlyWallet,
  setReadonlyAddress,
} from '../../api/wallet/readonly/readonly';
import { connectWallet, disconnectWallet } from '../../api/wallet/wallet';
import { patchSettings, useSettings } from '../../settings/settings';
import { ErgopaySettingsModal } from './ErgopaySettingsModal/ErgopaySettingsModal';

const ErgopaySwitch: React.FC<SwitchProps> = () => {
  const [{ ergopay }] = useSettings();
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const prepareWalletAndEnableErgopay = () => {
    if (isMobile) {
      disconnectWallet();
      patchSettings({ ergopay: true });
    } else if (!hasReadonlyAddress()) {
      if (!modalOpened) {
        setModalOpened(true);
        Modal.open(({ close }) => (
          <ErgopaySettingsModal
            close={(address) => {
              close();
              setModalOpened(false);
              if (address) {
                setReadonlyAddress(address);
                patchSettings({ ergopay: true });
                connectWallet(ReadonlyWallet).subscribe(() => {});
              }
            }}
          />
        ));
      }
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
    [ergopay, modalOpened],
  );

  return (
    <Switch checked={ergopay} size="small" onChange={handleChangeErgopay} />
  );
};

export { ErgopaySwitch };
