import { Button, Input, useInput } from '@geist-ui/react';
import React, { useCallback, useState } from 'react';

import {
  SlippageDecimals,
  SlippageMax,
  SlippageMin,
} from '../../constants/settings';
import { DefaultSettings } from '../../context';
import { countDecimals } from '../../utils/numbers';
import { toFloat } from '../../utils/string';
import { AutoInputContainer } from './AutoInputContainer';
import { FormError } from './FormError';

const content = {
  autoButton: 'Auto',
};

type SlippageInputProps = {
  slippage: string;
  setSlippage: (num: string) => void;
};

const getStatus = ({ error, warning }: { error: string; warning: string }) => {
  if (error) {
    return 'error';
  }

  if (warning) {
    return 'warning';
  }

  return undefined;
};

export const SlippageInput = (props: SlippageInputProps): JSX.Element => {
  const { slippage, setSlippage } = props;

  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
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
          setIsAuto(true);
          return;
        }

        const numValue = parseFloat(value);

        if (numValue > 100) {
          setError('Enter a valid slippage percentage');
          setWarning('');
        } else if (numValue > 1) {
          setWarning('Your transaction may be frontrun');
          setError('');
        } else {
          setError('');
          setWarning('');
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
    setWarning('');
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
      if (error) {
        setIsAuto(true);
        setState('');
        setSlippage('');
        setError('');
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
          status={getStatus({ error, warning })}
          clearable
          labelRight="%"
          min={SlippageMin}
          max={SlippageMax}
          placeholder={DefaultSettings.slippage.toString()}
          onChange={handleChange}
        />
      </AutoInputContainer>
      <FormError type={getStatus({ error, warning })}>
        {error || warning}
      </FormError>
    </>
  );
};
