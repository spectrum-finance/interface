import { useEffect, useState } from 'react';

import useFetch from './useAdaPrice';

const useDeposit = () => {
  const addressDeposit =
    'addr_test1qp3rdw6z8j02mpdw4exp2t4yvzlzlq8qcnp9nrl6knc3eh9glz4js4pan5rq2nyacvy0gmu2ka46865k08yf6zmqsncs49vsu3';
  const apiUsdAda = '/api/adaprice';
  const [isCopied, setIsCopied] = useState<boolean>(false);
  useState<string | undefined>();
  const [usdAda, setUsdAda] = useState<string | undefined>();
  const [valueAdaInput, setValueAdaInput] = useState<string>('');
  const [valueTedyInput, setValueTedyInput] = useState<string>('0.0');

  const { data, loading } = useFetch(apiUsdAda);

  const validInput = (value: string) => {
    return value.length < 10;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('.')) {
      value = '0' + value;
    }
    if (validInput(value)) {
      setValueAdaInput(value);
    }
  };

  const formatAmountTedy = (value: number) => {
    const number = value.toFixed(8).replace(/\.?0+$/, '');
    const formated = Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 12,
    }).format(Number(number));
    return formated;
  };

  const formatAmountUsd = (value: number) => {
    const formated = `~$${Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}`;
    return formated;
  };

  useEffect(() => {
    const value = Number(valueAdaInput) * 5;
    if (valueAdaInput === '' || Number(valueAdaInput) === 0) {
      setValueTedyInput('0.0');
    } else {
      setValueTedyInput(formatAmountTedy(value));
    }
  }, [valueAdaInput]);

  useEffect(() => {
    if (valueAdaInput === '' || Number(valueAdaInput) === 0) {
      setUsdAda('~$0');
    } else {
      setUsdAda(formatAmountUsd(Number(data) * Number(valueAdaInput)));
    }
  }, [valueAdaInput, data]);

  const handleWheel: React.WheelEventHandler<HTMLInputElement> = (e) => {
    const inputElement = e.target as HTMLInputElement;
    inputElement.blur();
    setTimeout(() => {
      inputElement.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === '+' ||
      e.key === '-' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'e' ||
      e.key === 'E'
    ) {
      e.preventDefault();
    }
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(addressDeposit);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error('error', err);
      setIsCopied(false);
    }
  };

  return {
    addressDeposit,
    isCopied,
    handleCopyClick,
    usdAda,
    loading,
    handleKeyDown,
    handleValueChange,
    valueAdaInput,
    handleWheel,
    valueTedyInput,
  };
};

export default useDeposit;
