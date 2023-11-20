import { useEffect, useState } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { networkAssetBalance$ } from '../../../gateway/api/networkAssetBalance';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';

const useDeposit = () => {
  const addressDeposit =
    'addr_test1qq9xk4nqkzpp8hcmg9452usxkarg2nkggz7m3kzpp0dq4qpzunpnynvz0n2ycgn3pvnhfa20xdj5ks9zefeeyyrckkusc0zafl';

  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const [networkAssetBalance] = useObservable(networkAssetBalance$);

  const [isCopied, setIsCopied] = useState<boolean>(false);
  useState<string | undefined>();
  const [valueAdaInput, setValueAdaInput] = useState<string>('');
  const [valueTedyInput, setValueTedyInput] = useState<string>('0.0');
  const [isValidInput, setIsValidInput] = useState({
    valid: false,
    text: 'Enter an amount',
  });

  const validInput = (value: string) => {
    return value.length < 12;
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

  const handleClickMax = () => {
    if (networkAssetBalance) {
      setValueAdaInput(
        formatAmountToken(Number(networkAssetBalance.amount) / 1000000),
      );
    } else {
      setValueAdaInput('');
    }
  };

  const formatAmountToken = (value: number) => {
    let formattedValue = value.toFixed(8).toString();
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }
    formattedValue = formattedValue.replace(/\.?0+$/, '');
    return formattedValue;
  };

  const formatAmountTedy = (value: number) => {
    const number = value.toFixed(8).replace(/\.?0+$/, '');
    const formated = Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 12,
    }).format(Number(number));
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
      setIsValidInput({ valid: false, text: 'Enter an amount' });
    } else if (
      networkAssetBalance &&
      Number(valueAdaInput) > Number(networkAssetBalance.amount) / 1000000
    ) {
      setIsValidInput({ valid: false, text: 'Invalid amount' });
    } else {
      setIsValidInput({ valid: true, text: '' });
    }
  }, [networkAssetBalance, valueAdaInput]);

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

  const handleClickDeposit = () => {
    const depositValue = BigInt(Number(valueAdaInput) * 1000000);
    console.log(`Deposit value:  ${depositValue}`);
  };

  return {
    addressDeposit,
    isCopied,
    handleCopyClick,
    handleKeyDown,
    handleValueChange,
    valueAdaInput,
    handleWheel,
    valueTedyInput,
    handleClickMax,
    isWalletConnected,
    isValidInput,
    handleClickDeposit,
  };
};

export default useDeposit;
