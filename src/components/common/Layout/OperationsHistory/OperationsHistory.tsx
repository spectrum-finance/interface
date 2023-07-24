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
import { pendingOperationsCount$ } from '../../../../gateway/api/pendingOperations';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { WalletState } from '../../../../network/common/Wallet';
import {
  closeRefundOperationNotification,
  showRefundOperationNotification,
} from '../../../../services/notifications/RefundOperation/RefundOperation';
import { BadgeCustom } from '../../../BadgeCustom/BadgeCustom';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

const renderHistoryButtonState = (pendingOpsCount: number): string => {
  return !!pendingOpsCount ? `${pendingOpsCount} ` + t`Pending` : '';
};

export const OperationsHistory: FC = () => {
  const [pendingOperationsCount] = useObservable(pendingOperationsCount$);
  const [walletState] = useObservable(selectedWalletState$);
  // TODO: move to new history once backend is ready
  // const [operations] = useObservable(getOperations(), [walletState]);

  const isWalletConnected = walletState === WalletState.CONNECTED;

  const [hasOperationsToRefund] = useState<boolean>(false);

  // useEffect(() => {
  //   if (operations) {
  //     setHasOperationsToRefund(
  //       // @ts-ignore
  //       operations.some((op) => {
  //         if (op.status) {
  //           return op.status === 'locked';
  //         }
  //       }) && isWalletConnected,
  //     );
  //   }
  // }, [operations]);

  useEffect(() => {
    if (hasOperationsToRefund && isWalletConnected) {
      showRefundOperationNotification();
    } else {
      closeRefundOperationNotification();
    }
  }, [hasOperationsToRefund, isWalletConnected]);

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => <OperationHistoryModal close={close} />);
  };

  const showLoader = !!pendingOperationsCount;

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
          {renderHistoryButtonState(pendingOperationsCount || 0)}
        </Button>
      </BadgeCustom>
    </Tooltip>
  );
};
