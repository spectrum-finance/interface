import { FC, ReactNode, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { first, Observable } from 'rxjs';

import { TxId } from '../../../../common/types';
import {
  createErgoPayDeepLink,
  createUnsignedTxRequestLink,
} from './common/ergopayLinks';
import { ErgoPayRequestLoadingContent } from './ErgoPayRequestLoadingContent/ErgoPayRequestLoadingContent';
import { ErgoPayTxInfoContent } from './ErgoPayTxInfoContent/ErgoPayTxInfoContent';

export interface ErgoPaySwapConfirmationModalProps {
  readonly onTxRegister: (txId: TxId) => void;
  readonly request?: Observable<TxId>;
  readonly openWalletContent?: (
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
  request,
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

  useEffect(() => {
    if (request) {
      request.pipe(first()).subscribe(handleTxRegister);
    }
  }, []);

  if (request && modalState === ErgoPayConfirmationModalState.OPEN_WALLET) {
    return <ErgoPayRequestLoadingContent />;
  }
  if (txId && modalState === ErgoPayConfirmationModalState.TX_INFO) {
    return <ErgoPayTxInfoContent txId={txId} />;
  }
  return <>{openWalletContent ? openWalletContent(handleTxRegister) : ''}</>;
};
