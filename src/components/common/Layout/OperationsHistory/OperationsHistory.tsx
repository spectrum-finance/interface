import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { getOperations } from '../../../../gateway/api/transactionsHistory';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { pendingCardanoOperations$ } from '../../../../network/cardano/api/transactionHistory/transactionHistory';
import { WalletState } from '../../../../network/common/Wallet';
import { mempoolRawOperations$ } from '../../../../network/ergo/api/operations/history/v2/operationsHistory';
import {
  closeRefundOperationNotification,
  showRefundOperationNotification,
} from '../../../../services/notifications/RefundOperation/RefundOperation';
import { BadgeCustom } from '../../../BadgeCustom/BadgeCustom';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

const renderHistoryButtonState = (pendingOps: any): string => {
  return !!pendingOps?.length ? `${pendingOps?.length} ` + t`Pending` : '';
};

export const OperationsHistory: FC = () => {
  const [selectedNetwork] = useSelectedNetwork();
  const [pendingOperations] = useObservable<any[]>(
    selectedNetwork.name === 'ergo'
      ? mempoolRawOperations$
      : pendingCardanoOperations$, // TODO: replace this with api mempoolRawOperations$ once backend for Cardano mempool is ready
  );
  const [walletState] = useObservable(selectedWalletState$);
  // TODO: move to new history once backend is ready
  const [operations] = useObservable(getOperations(), [walletState]);

  const isWalletConnected = walletState === WalletState.CONNECTED;

  const [hasOperationsToRefund, setHasOperationsToRefund] =
    useState<boolean>(false);

  useEffect(() => {
    if (operations) {
      setHasOperationsToRefund(
        // @ts-ignore
        operations.some((op) => {
          if (op.status) {
            return op.status === 'locked';
          }
        }) && isWalletConnected,
      );
    }
  }, [operations]);

  useEffect(() => {
    if (hasOperationsToRefund && isWalletConnected) {
      showRefundOperationNotification();
    } else {
      closeRefundOperationNotification();
    }
  }, [hasOperationsToRefund, isWalletConnected]);

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => (
      <OperationHistoryModal
        showDateTime={selectedNetwork.name === 'ergo'}
        close={close}
      />
    ));
  };

  const showLoader = !!pendingOperations?.length;

  return (
    <Tooltip
      title={
        !isWalletConnected
          ? t`Connect Wallet to see your recent transactions`
          : hasOperationsToRefund
          ? t`You have locked transactions. Refund them now!`
          : t`Recent transactions`
      }
      width="100%"
      maxWidth={200}
      placement="bottomLeft"
    >
      <BadgeCustom isShow={hasOperationsToRefund}>
        <Button
          size="large"
          type="ghost"
          icon={showLoader ? <LoadingOutlined /> : <HistoryOutlined />}
          onClick={openOperationsHistoryModal}
          disabled={!isWalletConnected}
        >
          {renderHistoryButtonState(pendingOperations)}
        </Button>
      </BadgeCustom>
    </Tooltip>
  );
};
