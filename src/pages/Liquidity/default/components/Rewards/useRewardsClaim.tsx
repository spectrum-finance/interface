import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { TxCandidate } from '@teddyswap/cardano-dex-sdk';
import { useState } from 'react';
import { first, map, switchMap } from 'rxjs';

import { transactionBuilder$ } from '../../../../../network/cardano/api/operations/common/transactionBuilder';
import { settings } from '../../../../../network/cardano/settings/settings';

const useRewardsClaim = () => {
  const [transactionStatus, setTransactionStatus] = useState<
    'processing' | 'complete' | 'error' | undefined
  >();
  const sendAdaTransacion = (adaAmount: bigint, targetAddress: string) => {
    setTransactionStatus('processing');
    return transactionBuilder$.pipe(
      switchMap((txBuilder) => {
        return txBuilder.sendAdaToAddress({
          lovelace: adaAmount,
          changeAddress: settings.address!,
          targetAddress: targetAddress,
        });
      }),
      map(
        ([transaction]: [Transaction | null, TxCandidate, Error | null]) =>
          transaction!,
      ),
      first(),
    );
  };

  return { sendAdaTransacion, transactionStatus, setTransactionStatus };
};

export default useRewardsClaim;
