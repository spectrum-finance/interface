import React, { useCallback, useState } from 'react';
import { Button, Input, useInput } from '@geist-ui/react';
import { DefaultSettings, Settings } from '../../context/SettingsContext';
import { AutoInputContainer } from './AutoInputContainer';
import { SlippageMax } from '../../constants/settings';
import { FormError } from './FormError';

const content = {
  autoButton: 'Auto',
};

type SlippageInputProps = {
  slippage: number;
  updateSettings: (update: Partial<Settings>) => void;
};

export const SlippageInput = (props: SlippageInputProps): JSX.Element => {
  const { slippage, updateSettings } = props;

  const [error, setError] = useState('');

  const isAuto = slippage === DefaultSettings.slippage;

  const { state, setState, bindings } = useInput(
    isAuto ? '' : slippage.toString(),
  );

  const handleChange = useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      if (e) {
        const value = e.target.value;

        setState(value);
        if (value) {
          const num = parseFloat(e.target.value);
          if (num >= 0) {
            if (num > 0 && num <= SlippageMax) {
              updateSettings({
                slippage: num,
              });
              setError('');
            } else {
              setError(`must be greater than 0 and less than ${SlippageMax}`);
            }
          } else {
            setError(`must be a number`);
          }
        }
      }
    },
    [updateSettings],
  );

  const handleReset = useCallback(() => {
    updateSettings({
      slippage: DefaultSettings.slippage,
    });
    setState('');
    setError('');
  }, [updateSettings]);

  const handleOnBlur = useCallback(() => {
    if (state === DefaultSettings.slippage.toString()) {
      handleReset();
    }
  }, [state, handleReset]);

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
          labelRight="%"
          min="0"
          max={SlippageMax}
          placeholder={DefaultSettings.slippage.toString()}
          onChange={handleChange}
        />
      </AutoInputContainer>
      <FormError>{error}</FormError>
    </>
  );
};
