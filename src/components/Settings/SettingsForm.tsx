import React, { useCallback } from 'react';
import { Button, Input, Text, Tooltip } from '@geist-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Settings } from '../../context/SettingsContext';
import { DexFeeInput } from './DexFeeInput';
import { SlippageInput } from './SlippageInput';

const content = {
  dex: {
    label: 'DEX Fee',
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
  onConnectWallet: () => void;
  isWalletConnected?: boolean;
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

export const SettingsForm = (props: SettingsFormProps): JSX.Element => {
  const {
    settings,
    settings: { dexFee, slippage },
    setSettings,
    onConnectWallet,
    isWalletConnected,
  } = props;

  const updateSettings = useCallback(
    (update: Partial<Settings>) => {
      setSettings({
        ...settings,
        ...update,
      });
    },
    [settings],
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
        <DexFeeInput dexFee={dexFee} updateSettings={updateSettings} />
      </div>
      <div>
        <Text p>
          {content.address.label}{' '}
          <Tooltip text={content.address.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>
        {isWalletConnected ? (
          <Input placeholder="0"></Input>
        ) : (
          <Button onClick={onConnectWallet} auto>
            {content.address.connectButton}
          </Button>
        )}
      </div>
      <div>
        <Text p>
          {content.slippage.label}{' '}
          <Tooltip text={content.slippage.tooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Tooltip>
        </Text>
        <SlippageInput slippage={slippage} updateSettings={updateSettings} />
      </div>
    </div>
  );
};
