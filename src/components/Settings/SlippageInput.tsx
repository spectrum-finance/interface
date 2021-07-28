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

const content = {
  autoButton: 'Auto',
};

type SlippageInputProps = {
  slippage: number;
  setSlippage: (num: number) => void;
};

const toPercent = (num: number | string): number =>
  typeof num === 'string' ? Number(num) * 100 : num * 100;
const fromPercent = (num: number | string): number =>
  typeof num === 'string' ? Number(num) / 100 : num / 100;

export const SlippageInput = (props: SlippageInputProps): JSX.Element => {
  const { slippage, setSlippage } = props;

  const [error, setError] = useState('');
  const [isAuto, setIsAuto] = useState(slippage === DefaultSettings.slippage);

  const { state, setState, bindings } = useInput(
    isAuto ? '' : slippage.toString(),
  );

  const handleChange = useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      if (e) {
        const value = e.target.value;
        setIsAuto(false);

        setState(fromPercent(value).toString());
        if (value) {
          const num = parseFloat(e.target.value);
          if (num >= SlippageMin) {
            if (num >= SlippageMin && num <= SlippageMax) {
              if (countDecimals(num) > SlippageDecimals) {
                setError(`must be <= ${SlippageDecimals} decimal places`);
              } else {
                setSlippage(fromPercent(num));
                setError('');
              }
            } else {
              setError(`must be >= ${SlippageMin} and <= ${SlippageMax}`);
            }
          } else {
            setError(`must be a number`);
          }
        }
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
          setSlippage(parseFloat(decimal));
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
          value={toPercent(bindings.value).toString()}
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
