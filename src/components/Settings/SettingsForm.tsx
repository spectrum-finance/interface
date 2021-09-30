import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Tooltip } from '@geist-ui/react';
import React, { useCallback } from 'react';

import { Settings } from '../../context';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { SelectAddress } from '../SelectAddress/SelectAddress';
import { MinerFeeInput } from './MinerFeeInput';

const content = {
  dex: {
    label: 'Miner Fee',
    tooltip: 'Fee charged by miners',
  },
  address: {
    label: 'Output address',
    tooltip: 'Address to receive exchanged tokens',
    connectButton: 'Connect to a wallet',
  },
  slippage: {
    label: 'Slippage tolerance',
    tooltip:
      'Your transaction will revert if the price changes unfavorably by more than this percentage.',
  },
};

type SettingsFormProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  addresses: string[];
};

export const SettingsForm = (props: SettingsFormProps): JSX.Element => {
  const {
    settings,
    settings: { minerFee },
    setSettings,
    addresses,
  } = props;

  const updateSettings = useCallback(
    (update: Partial<Settings>) => {
      setSettings({
        ...settings,
        ...update,
      });
    },
    [settings, setSettings],
  );

  const handleSelectAddress = useCallback(
    (value: string | string[]) => {
      const selected = typeof value === 'string' ? value : value[0];
      updateSettings({
        address: selected,
      });
    },
    [updateSettings],
  );

  return (
    <div>
      <div>
        <Text span>
          {content.dex.label}{' '}
          <Tooltip text={content.dex.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>
        <MinerFeeInput minerFee={minerFee} updateSettings={updateSettings} />
      </div>
      <div>
        <Text span>
          {content.address.label}{' '}
          <Tooltip text={content.address.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>

        {addresses.length ? (
          <SelectAddress
            addresses={addresses}
            selectedAddress={settings.address || ''}
            onSelectAddress={handleSelectAddress}
          />
        ) : (
          <ConnectWallet />
        )}
      </div>
    </div>
  );
};
