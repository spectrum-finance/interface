import axios from 'axios';
import { DateTime } from 'luxon';
import React, { FC, useEffect } from 'react';
import { first, map, publishReplay, refCount, switchMap } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { useObservable } from '../../../common/hooks/useObservable';
import { Operation } from '../../../common/models/Operation';
import { getAddresses } from '../../../gateway/api/addresses';
import { getOperations } from '../../../gateway/api/transactionsHistory';
import { SortDirection } from '../../TableView/common/Sort';
import { TableView } from '../../TableView/TableView';
import { AssetCell } from '../common/cells/AssetCell/AssetCell';
import { DateTimeCell } from '../common/cells/DateTimeCell/DateTimeCell';
import { FeeCell } from '../common/cells/FeeCell/FeeCell';
import { StatusCell } from '../common/cells/StatusCell/StatusCell';
import { TypeCell } from '../common/cells/TypeCell/TypeCell';
import { statusFilter } from '../common/filters/statusFilter';
import { typeFilter } from '../common/filters/typeFilter';
import { LoadingState } from '../common/states/LoadingState/LoadingState';
import { OperationSearchEmptyState } from '../common/states/OperationSearchEmptyState/OperationSearchEmptyState';
import { OperationDetails } from './OperationDetails/OperationDetails';

const operations$ = getAddresses().pipe(
  first(),
  switchMap((addresses) =>
    axios.post(
      `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=30&offset=0`,
      { addresses },
    ),
  ),
  map((res) => res.data.orders),
  publishReplay(1),
  refCount(),
);

export const OperationHistoryV2: FC = () => {
  const [operations, loading] = useObservable(getOperations(), [], []);
  const [operations2] = useObservable(operations$);

  useEffect(() => {
    console.log(operations2);
  }, [operations2]);

  return (
    <TableView
      actionsWidth={168}
      itemHeight={80}
      items={operations}
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
      <TableView.Column title="Assets" width={218} headerWidth={202}>
        {(op: Operation) => <AssetCell operation={op} />}
      </TableView.Column>
      <TableView.Column
        title="Type"
        width={110}
        filter={typeFilter}
        sortBy={(op: Operation) => op.type}
      >
        {(op: Operation) => <TypeCell type={op.type} />}
      </TableView.Column>
      <TableView.Column title="Fee" width={100} filter={typeFilter}>
        {(op: Operation) => <FeeCell operation={op} />}
      </TableView.Column>
      <TableView.Column
        defaultDirection={SortDirection.DESC}
        title="Date & Time"
        width={130}
        sortBy={(op: Operation) => op.dateTime || DateTime.now()}
      >
        {(op: Operation) => <DateTimeCell short dateTime={op.dateTime} />}
      </TableView.Column>
      <TableView.Column
        title="Status"
        filter={statusFilter}
        sortBy={(op: Operation) => op.status}
      >
        {(op: Operation) => <StatusCell status={op.status} />}
      </TableView.Column>

      <TableView.State condition={loading} name="loading">
        <LoadingState />
      </TableView.State>
    </TableView>
  );
};
