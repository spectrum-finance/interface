import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { getOperations } from '../../../network/ergo/api/operations/history/v2/operationsHistory';
import { OperationItem } from '../../../network/ergo/api/operations/history/v2/types/OperationItem';
import { TableView } from '../../TableView/TableView';
import { LoadingState } from '../OperationHistoryV1/OperationHistoryTable/states/LoadingState/LoadingState';
import { OperationSearchEmptyState } from '../OperationHistoryV1/OperationHistoryTable/states/OperationSearchEmptyState/OperationSearchEmptyState';
import { AssetsCell } from './cells/AssetsCell/AssetsCell';
import { DateTimeCell } from './cells/DateTimeCell/DateTimeCell';
import { FeeCell } from './cells/FeeCell/FeeCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { TypeCell } from './cells/TypeCell/TypeCell';
import { OperationDetails } from './OperationDetails/OperationDetails';

// const operations2$ = getAddresses().pipe(
//   first(),
//   switchMap((addresses) => interval(3000).pipe(mapTo(addresses))),
//   switchMap((addresses) =>
//     axios.post(
//       `${applicationConfig.networksSettings.ergo.analyticUrl}history/mempool`,
//       addresses,
//     ),
//   ),
//   map((res) => res.data),
//   publishReplay(1),
//   refCount(),
// );

export const OperationHistoryV2: FC = () => {
  const [operations, loading] = useObservable(getOperations());

  return (
    <TableView
      actionsWidth={168}
      itemHeight={80}
      items={operations || []}
      maxHeight={376}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4, 0, 2]}
      gap={1}
      itemKey="id"
      emptyFilterView={<OperationSearchEmptyState />}
      expandPadding={[0, 0]}
      expand={{
        component: OperationDetails,
        height: 132,
      }}
    >
      <TableView.Column title={t`Assets`} width={218} headerWidth={202}>
        {(operationItem: OperationItem) => (
          <AssetsCell operationItem={operationItem} />
        )}
      </TableView.Column>
      <TableView.Column title="Type" width={120}>
        {(operationItem: OperationItem) => (
          <TypeCell operationItem={operationItem} />
        )}
      </TableView.Column>
      <TableView.Column title="Fee" width={90}>
        {(operationItem: OperationItem) => (
          <FeeCell operationItem={operationItem} />
        )}
      </TableView.Column>
      <TableView.Column title={t`Date & Time`} width={110}>
        {(operationItem: OperationItem) => (
          <DateTimeCell operationItem={operationItem} />
        )}
      </TableView.Column>
      <TableView.Column title={t`Status`}>
        {(operationItem: OperationItem) => (
          <StatusCell operationItem={operationItem} />
        )}
      </TableView.Column>

      <TableView.State condition={loading} name="loading">
        <LoadingState />
      </TableView.State>
    </TableView>
  );
};
