import { ModalRef } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { isSwapOperation, Operation } from '../../../common/models/Operation';
import { exploreTx } from '../../../gateway/utils/exploreAddress';
import { RefundConfirmationModal } from '../../common/TxHistory/RefundConfirmationModal/RefundConfirmationModal';
import {
  openConfirmationModal,
  Operation as ConfirmationOperation,
} from '../../ConfirmationModal/ConfirmationModal';
import { SortDirection } from '../../TableView/common/Sort';
import { TableView } from '../../TableView/TableView';
import { DateTimeCell } from './cells/DateTimeCell/DateTimeCell';
import { DepositAssetCell } from './cells/DepositAssetCell/DepositAssetCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { SwapAssetCell } from './cells/SwapAssetCell/SwapAssetCell';
import { TypeCell } from './cells/TypeCell/TypeCell';
import { ClipboardDecorator } from './decorators/ClipboardDecorator';
import { RefundDecorator } from './decorators/RefundDecorator';
import { statusFilter } from './filters/statusFilter';
import { typeFilter } from './filters/typeFilter';
import { LoadingState } from './states/LoadingState/LoadingState';
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
  readonly addresses: string[];
}

export const OperationHistoryTable: FC<TransactionHistoryTableProps> = ({
  operations,
  loading,
  emptySearch,
  emptyOperations,
  showDateTime,
  hideHeader,
  hideActions,
  addresses,
  close,
}) => {
  const openRefundModal = (operation: Operation): void => {
    const payload =
      operation.type === 'swap'
        ? { xAsset: operation.base, yAsset: operation.quote }
        : { xAsset: operation.x, yAsset: operation.y };

    openConfirmationModal(
      (next) => {
        return (
          <RefundConfirmationModal
            operation={operation}
            addresses={addresses}
            onClose={next}
          />
        );
      },
      ConfirmationOperation.REFUND,
      payload,
    );
  };

  return (
    <TableView
      showHeader={!hideHeader}
      actionsWidth={168}
      itemHeight={80}
      items={operations}
      maxHeight={376}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 2]}
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
            <DepositAssetCell x={op.x} y={op.y} />
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
          sortBy={(op: Operation) => op.dateTime}
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
        <LoadingState />
      </TableView.State>
      <TableView.State condition={emptyOperations} name="empty">
        <OperationsEmptyState onSwapNowButtonClick={close} />
      </TableView.State>
      <TableView.State condition={emptySearch} name="search">
        <OperationSearchEmptyState />
      </TableView.State>

      {!hideActions && (
        <>
          <TableView.Action
            decorator={RefundDecorator}
            onClick={(op: Operation) => openRefundModal(op)}
          >
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
