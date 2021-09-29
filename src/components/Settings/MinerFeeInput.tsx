import { Button, Input, useInput } from '@geist-ui/react';
import React, { useCallback, useState } from 'react';

import { ERG_TOKEN_NAME } from '../../constants/erg';
import { MinerFeeMax, MinerFeeMin } from '../../constants/settings';
import { DefaultSettings, Settings } from '../../context';
import { AutoInputContainer } from './AutoInputContainer';
import { FormError } from './FormError';

const content = {
  autoButton: 'Auto',
};

type MinerFeeInputProps = {
  minerFee: string;
  updateSettings: (update: Partial<Settings>) => void;
};

export const MinerFeeInput = (props: MinerFeeInputProps): JSX.Element => {
  const { minerFee, updateSettings } = props;

  const [error, setError] = useState('');

  const isAuto = minerFee === DefaultSettings.minerFee;

  const { state, setState, bindings } = useInput(isAuto ? '' : minerFee);

  const handleChange = useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      if (e) {
        const value = e.target.value;

        setState(value);
        if (value) {
          const num = parseFloat(e.target.value);
          if (num >= MinerFeeMin) {
            if (num >= MinerFeeMin && num <= MinerFeeMax) {
              updateSettings({
                minerFee: num.toString(),
              });
              setError('');
            } else {
              setError(`must be >= ${MinerFeeMin} and >= ${MinerFeeMax}`);
            }
          } else {
            setError(`must be >= ${MinerFeeMin}`);
          }
        }
      }
    },
    [updateSettings, setState],
  );

  const handleReset = useCallback(() => {
    updateSettings({
      minerFee: DefaultSettings.minerFee,
    });
    setState('');
    setError('');
  }, [updateSettings, setState]);

  const handleOnBlur = useCallback(() => {
    if (state === DefaultSettings.minerFee || error) {
      handleReset();
    }
  }, [state, handleReset, error]);

  return (
    <>
      <AutoInputContainer>
        <Button
          auto
          type={isAuto ? 'success' : undefined}
          onClick={handleReset}
        >
          {content.autoButton}
        </Button>
        <Input
          {...bindings}
          onClearClick={handleReset}
          onBlur={handleOnBlur}
          status={error ? 'error' : undefined}
          clearable
          labelRight={ERG_TOKEN_NAME}
          min={MinerFeeMin}
          max={MinerFeeMax}
          placeholder={DefaultSettings.minerFee}
          onChange={handleChange}
        />
      </AutoInputContainer>
      <FormError type="error">{error}</FormError>
    </>
  );
};
