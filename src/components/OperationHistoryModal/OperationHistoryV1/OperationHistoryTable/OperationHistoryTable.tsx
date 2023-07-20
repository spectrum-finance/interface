import { ModalRef } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { first } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable.ts';
import {
  isSwapOperation,
  Operation,
} from '../../../../common/models/Operation';
import { refund } from '../../../../gateway/api/operations/refund';
import { useSelectedNetwork } from '../../../../gateway/common/network.ts';
import { exploreTx } from '../../../../gateway/utils/exploreAddress';
import { getIsCollateralProvided } from '../../../../network/cardano/api/utxos/utxos.ts';
import { sendCollateralGuideNotification } from '../../../../services/notifications/CollateralGuideNotification/CollateralGuideNotification.tsx';
import { ListSkeletonLoadingState } from '../../../SkeletonLoader/ListSkeletonLoadingState.tsx';
import { SortDirection } from '../../../TableView/common/Sort';
import { TableView } from '../../../TableView/TableView';
import { DateTimeCell } from './cells/DateTimeCell/DateTimeCell';
import { DepositAssetCell } from './cells/DepositAssetCell/DepositAssetCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { SwapAssetCell } from './cells/SwapAssetCell/SwapAssetCell';
import { TypeCell } from './cells/TypeCell/TypeCell';
import { ClipboardDecorator } from './decorators/ClipboardDecorator';
import { RefundDecorator } from './decorators/RefundDecorator';
import { statusFilter } from './filters/statusFilter';
import { typeFilter } from './filters/typeFilter';
import { OperationSearchEmptyState } from './states/OperationSearchEmptyState/OperationSearchEmptyState';
import { OperationsEmptyState } from './states/OperationsEmptyState/OperationsEmptyState';

export interface TransactionHistoryTableProps extends ModalRef {
  readonly operations: Operation[];
  readonly loading: boolean;
  readonly emptySearch: boolean;
  readonly emptyOperations: boolean;
  readonly showDateTime?: boolean;
  readonly hideHeader?: boolean;
  readonly hideActions?: boolean;
}

export const OperationHistoryTable: FC<TransactionHistoryTableProps> = ({
  operations,
  loading,
  emptySearch,
  emptyOperations,
  showDateTime,
  hideHeader,
  hideActions,
  close,
}) => {
  const [isCollateralProvided] = useObservable(getIsCollateralProvided(), []);
  const [selectedNetwork] = useSelectedNetwork();
  const handleRefund = (operation: Operation): void => {
    if (
      !isCollateralProvided &&
      (selectedNetwork.name === 'cardano_mainnet' ||
        selectedNetwork.name === 'cardano_preview')
    ) {
      sendCollateralGuideNotification();
      return;
    }

    const payload =
      operation.type === 'swap'
        ? { xAsset: operation.base, yAsset: operation.quote }
        : { xAsset: operation.x, yAsset: operation.y };

    refund(operation.txId, payload.xAsset, payload.yAsset)
      .pipe(first())
      .subscribe();
  };

  return (
    <TableView
      showHeader={!hideHeader}
      actionsWidth={168}
      itemHeight={80}
      items={operations}
      maxHeight={376}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4, 0, 2]}
      gap={1}
      itemKey="id"
      emptyFilterView={<OperationSearchEmptyState />}
    >
      <TableView.Column
        title="Assets"
        width={showDateTime ? 218 : 318}
        headerWidth={showDateTime ? 202 : 302}
      >
        {(op: Operation) =>
          isSwapOperation(op) ? (
            <SwapAssetCell base={op.base} quote={op.quote} />
          ) : (
            <DepositAssetCell
              x={op.x}
              y={op.y}
              hideAmount={op.type === 'redeem'}
            />
          )
        }
      </TableView.Column>
      <TableView.Column
        title="Type"
        width={152}
        filter={typeFilter}
        sortBy={(op: Operation) => op.type}
      >
        {(op: Operation) => <TypeCell type={op.type} />}
      </TableView.Column>
      {showDateTime && (
        <TableView.Column
          defaultDirection={SortDirection.DESC}
          title="Date & Time"
          width={152}
          sortBy={(op: Operation) => op.dateTime || DateTime.now()}
        >
          {(op: Operation) => <DateTimeCell dateTime={op.dateTime} />}
        </TableView.Column>
      )}

      <TableView.Column
        title="Status"
        width={152}
        filter={statusFilter}
        sortBy={(op: Operation) => op.status}
      >
        {(op: Operation) => <StatusCell status={op.status} />}
      </TableView.Column>

      <TableView.State condition={loading} name="loading">
        <ListSkeletonLoadingState numOfElements={5} />
      </TableView.State>
      <TableView.State condition={emptyOperations} name="empty">
        <OperationsEmptyState onSwapNowButtonClick={close} />
      </TableView.State>
      <TableView.State condition={emptySearch} name="search">
        <OperationSearchEmptyState />
      </TableView.State>

      {!hideActions && (
        <>
          <TableView.Action decorator={RefundDecorator} onClick={handleRefund}>
            <Trans>Refund transaction</Trans>
          </TableView.Action>
          <TableView.Action onClick={(op: Operation) => exploreTx(op.txId)}>
            <Trans>View on Explorer</Trans>
          </TableView.Action>
          <TableView.Action decorator={ClipboardDecorator}>
            <Trans>Copy Transaction Id</Trans>
          </TableView.Action>
        </>
      )}
    </TableView>
  );
};
