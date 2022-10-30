import React, { FC, ReactNode, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { TxId } from '../../../../common/types';
import {
  createErgoPayDeepLink,
  createUnsignedTxRequestLink,
} from './common/ergopayLinks';
import { ErgoPayTxInfoContent } from './ErgoPayTxInfoContent/ErgoPayTxInfoContent';

export interface ErgoPaySwapConfirmationModalProps {
  readonly onTxRegister: (txId: TxId) => void;
  readonly openWalletContent: (
    onTxRegister: (p: TxId) => void,
  ) => ReactNode | ReactNode[] | string;
  readonly close: () => void;
}

enum ErgoPayConfirmationModalState {
  OPEN_WALLET,
  TX_INFO,
}

export const ErgoPayModal: FC<ErgoPaySwapConfirmationModalProps> = ({
  onTxRegister,
  openWalletContent,
  close,
}) => {
  const [txId, setTxId] = useState<TxId | undefined>();
  const [modalState, setModalState] = useState(
    ErgoPayConfirmationModalState.OPEN_WALLET,
  );

  const handleTxRegister = (txId: TxId) => {
    onTxRegister(txId);
    if (isMobile) {
      window.location.replace(
        createErgoPayDeepLink(createUnsignedTxRequestLink(txId)),
      );
      close();
    } else {
      setTxId(txId);
      setModalState(ErgoPayConfirmationModalState.TX_INFO);
    }
  };

  if (txId && modalState === ErgoPayConfirmationModalState.TX_INFO) {
    return <ErgoPayTxInfoContent txId={txId} />;
  }
  return <>{openWalletContent(handleTxRegister)}</>;
};
