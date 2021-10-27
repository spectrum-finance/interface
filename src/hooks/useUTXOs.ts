import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { useContext, useEffect, useState } from 'react';

import { WalletContext } from '../context';

const useUTXOs = (): ErgoBox[] => {
  const { isWalletConnected } = useContext(WalletContext);
  const [UTXOs, setUTXOs] = useState<ErgoBox[]>([]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo
        .get_utxos()
        .then((bs) => (bs ? bs.map((b) => ergoBoxFromProxy(b)) : bs))
        .then((data) => setUTXOs(data ?? []));
    }
  }, [isWalletConnected]);

  return UTXOs;
};

export { useUTXOs };
