import React, { FC, useState } from 'react';

import { TxId } from '../../../../../common/types';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { ErgoPayOpenWalletContent } from './ErgoPayOpenWalletContent/ErgoPayOpenWalletContent';
import { ErgoPayTxInfoContent } from './ErgoPayTxInfoContent/ErgoPayTxInfoContent';

export interface ErgoPaySwapConfirmationModalProps {
  readonly value: Required<SwapFormModel>;
  readonly onTxRegister: (txId: TxId) => void;
}

enum ErgoPayConfirmationModalState {
  OPEN_WALLET,
  TX_INFO,
}

export const ErgoPaySwapConfirmationModal: FC<ErgoPaySwapConfirmationModalProps> =
  ({ value, onTxRegister }) => {
    const [txId, setTxId] = useState<TxId | undefined>();
    const [modalState, setModalState] = useState(
      ErgoPayConfirmationModalState.OPEN_WALLET,
    );

    const handleTxRegister = (txId: TxId) => {
      setTxId(txId);
      setModalState(ErgoPayConfirmationModalState.TX_INFO);
      onTxRegister(txId);
    };

    if (txId && modalState === ErgoPayConfirmationModalState.TX_INFO) {
      return <ErgoPayTxInfoContent txId={txId} />;
    }
    return (
      <ErgoPayOpenWalletContent value={value} onTxRegister={handleTxRegister} />
    );
  };
