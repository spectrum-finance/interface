import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { hasNeedRefundOperations$ } from '../../../../gateway/api/hasNeedRefundOperations';
import { pendingOperationsCount$ } from '../../../../gateway/api/pendingOperations';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { WalletState } from '../../../../network/common/Wallet';
import { BadgeCustom } from '../../../BadgeCustom/BadgeCustom';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

const renderHistoryButtonState = (pendingOpsCount: number): string => {
  return !!pendingOpsCount ? `${pendingOpsCount} ` + t`Pending` : '';
};

export const OperationsHistory: FC = () => {
  const [pendingOperationsCount] = useObservable(pendingOperationsCount$);
  const [walletState] = useObservable(selectedWalletState$);

  const isWalletConnected = walletState === WalletState.CONNECTED;
  const [hasOperationsToRefund] = useObservable<boolean>(
    hasNeedRefundOperations$,
  );

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => <OperationHistoryModal close={close} />);
  };

  const showLoader = !!pendingOperationsCount;

  return (
    <Tooltip
      title={
        !isWalletConnected
          ? t`Connect Wallet to see your recent transactions`
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
          style={{ background: 'var(--teddy-box-color)' }}
        >
          {renderHistoryButtonState(pendingOperationsCount || 0)}
        </Button>
      </BadgeCustom>
    </Tooltip>
  );
};
