import React, { useCallback } from 'react';
import { Select, Text, Tooltip } from '@geist-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Settings } from '../../context/SettingsContext';
import { MinerFeeInput } from './MinerFeeInput';
import { SlippageInput } from './SlippageInput';
import { OverflowAddress } from './OverflowAddress';

const content = {
  dex: {
    label: 'Miner Fee',
    tooltip: 'TODO',
  },
  address: {
    label: 'Output address',
    tooltip: 'TODO',
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
    settings: { minerFee, address },
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
        <Text p>
          {content.dex.label}{' '}
          <Tooltip text={content.dex.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>
        <MinerFeeInput minerFee={minerFee} updateSettings={updateSettings} />
      </div>
      <div>
        <Text p>
          {content.address.label}{' '}
          <Tooltip text={content.address.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>

        {addresses.length ? (
          <Select
            initialValue={address}
            onChange={handleSelectAddress}
            width="100%"
          >
            {addresses.map((address: string) => (
              <Select.Option key={address} value={address}>
                <OverflowAddress address={address} />
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Text p small type="secondary">
            {content.address.connectButton}
          </Text>
        )}
      </div>
    </div>
  );
};
