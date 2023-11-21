import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { TxCandidate } from '@teddyswap/cardano-dex-sdk';
import { useEffect, useState } from 'react';
import { first, map, switchMap } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { useObservable } from '../../../common/hooks/useObservable';
import { networkAssetBalance$ } from '../../../gateway/api/networkAssetBalance';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { submitTx } from '../../../network/cardano/api/operations/common/submitTxCandidate';
import { transactionBuilder$ } from '../../../network/cardano/api/operations/common/transactionBuilder';
import { settings } from '../../../network/cardano/settings/settings';
import { cardanoNetworkData } from '../../../network/cardano/utils/cardanoNetworkData';

const useDeposit = () => {
  const RATE = 0.444;
  const addressDeposit =
    'addr_test1qzhwefhsv6xn2s4sn8a92f9m29lwj67aykn4plr9xal4r48del5pz2hf795j5wxzhzf405g377jmw7a92k9z2enhd6pqutz67m';

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

  const [lovelaceBalance, setLovelaceBalance] = useState<bigint>(BigInt(0));

  const fetchBalance = async (offset = 0, totalBalance = BigInt(0)) => {
    try {
      const response = await fetch(
        `${cardanoNetworkData.networkUrl}/outputs/unspent/byAddr/${addressDeposit}?limit=500&offset=${offset}`,
      );
      const data = await response.json();

      if (data.items.length === 0) {
        // If no items are returned, set the total balance and stop fetching
        setLovelaceBalance(totalBalance);
        return;
      }

      const lovelace = data.items
        .filter((item) =>
          item.value.some((v) => v.policyId === '' && v.name === ''),
        )
        .reduce(
          (total, item) => total + BigInt(item.value[0].quantity),
          totalBalance,
        );

      // Call the function recursively with updated offset and total balance
      fetchBalance(offset + 500, lovelace);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(
      () => fetchBalance(),
      applicationConfig.applicationTick,
    ); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

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
    const value = Number(valueAdaInput) * RATE;
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
    toSendLovelaceTxCandidate(depositValue)
      .pipe(switchMap((tx) => submitTx(tx)))
      .subscribe({
        complete: () => {
          setValueAdaInput('0');
        },
      });
  };

  const toSendLovelaceTxCandidate = (lovelace: bigint) => {
    return transactionBuilder$.pipe(
      switchMap((txBuilder) => {
        return txBuilder.sendAdaToAddress({
          lovelace,
          changeAddress: settings.address!,
          targetAddress: addressDeposit,
        });
      }),
      map(
        ([transaction]: [Transaction | null, TxCandidate, Error | null]) =>
          transaction!,
      ),
      first(),
    );
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
    lovelaceBalance,
  };
};

export default useDeposit;
