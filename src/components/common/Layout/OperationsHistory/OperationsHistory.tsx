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
import { pendingOperations$ } from '../../../../gateway/api/pendingOperations';
import { getOperations } from '../../../../gateway/api/transactionsHistory.ts';
import { selectedWalletState$ } from '../../../../gateway/api/wallets.ts';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { WalletState } from '../../../../network/common/Wallet.ts';
import { mempoolRawOperations$ } from '../../../../network/ergo/api/operations/history/v2/operationsHistory';
import { showRefundOperationNotification } from '../../../../services/notifications/RefundOperation/RefundOperation.tsx';
import { BadgeCustom } from '../../../BadgeCustom/BadgeCustom.tsx';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

export const OperationsHistory: FC = () => {
  const [selectedNetwork] = useSelectedNetwork();
  const [pendingOperations, pendingLoading] = useObservable<any[]>(
    selectedNetwork.name === 'ergo'
      ? mempoolRawOperations$
      : (pendingOperations$ as any),
  );
  const [walletState] = useObservable(selectedWalletState$);
  const [operations] = useObservable(getOperations(), [walletState]);
  const isWalletConnected = walletState === WalletState.CONNECTED;

  const [hasOperationsToRefund, setHasOperationsToRefund] =
    useState<boolean>(false);

  useEffect(() => {
    if (operations) {
      setHasOperationsToRefund(
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

  const showLoader = !!pendingOperations?.length || pendingLoading;

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
          {!!pendingOperations?.length
            ? `${pendingOperations?.length} ` + t`Pending`
            : ''}
        </Button>
      </BadgeCustom>
    </Tooltip>
  );
};
