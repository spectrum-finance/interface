import React, { useCallback, useState } from 'react';
import { Button, Input, useInput } from '@geist-ui/react';
import { DefaultSettings } from '../../context/SettingsContext';
import { AutoInputContainer } from './AutoInputContainer';
import {
  SlippageDecimals,
  SlippageMax,
  SlippageMin,
} from '../../constants/settings';
import { FormError } from './FormError';
import { countDecimals } from '../../utils/numbers';
import { toFloat } from '../../utils/string';

const content = {
  autoButton: 'Auto',
};

type SlippageInputProps = {
  slippage: string;
  setSlippage: (num: string) => void;
};

export const SlippageInput = (props: SlippageInputProps): JSX.Element => {
  const { slippage, setSlippage } = props;

  const [error, setError] = useState('');
  const [isAuto, setIsAuto] = useState(slippage === DefaultSettings.slippage);

  const { state, setState, bindings } = useInput(slippage);

  const handleChange = useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      if (e) {
        const value = toFloat(e.target.value, SlippageDecimals);
        setIsAuto(false);

        if (!value) {
          setState('');
          setSlippage('');
          setError(`Slippage field could not be empty`);
          setIsAuto(true);
          return;
        }

        const numValue = parseFloat(value);

        if (numValue > 100) {
          setError(`Enter a valid slippage percentage`);
        } else if (numValue > 1) {
          setError(`Your transaction may be frontrun`);
        } else {
          setError('');
        }

        setState(value);
        setSlippage(value);
      }
    },
    [setSlippage, setState],
  );

  const handleReset = useCallback(() => {
    setSlippage(DefaultSettings.slippage);
    setState('');
    setError('');
    setIsAuto(true);
  }, [setSlippage, setState]);

  const handleOnBlur = useCallback(() => {
    if (state === DefaultSettings.slippage.toString()) {
      handleReset();
    } else {
      if (state && !error) {
        const num = parseFloat(state);
        if (countDecimals(num) != SlippageDecimals) {
          const decimal = num.toFixed(SlippageDecimals);
          setSlippage(String(parseFloat(decimal)));
          setState(decimal);
        }
      }
    }
  }, [state, error, handleReset, setSlippage, setState]);

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
          min={SlippageMin}
          max={SlippageMax}
          placeholder={DefaultSettings.slippage.toString()}
          onChange={handleChange}
        />
      </AutoInputContainer>
      <FormError>{error}</FormError>
    </>
  );
};
