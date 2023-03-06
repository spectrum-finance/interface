import { Flex, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';

import { useSubject } from '../../../common/hooks/useObservable';
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
import { statusFilterRender } from './filters/statusFilter';
import { OperationDetails } from './OperationDetails/OperationDetails';
import { OperationPagination } from './OperationPagination/OperationPagination';

const LIMIT = 25;

export const OperationHistoryV2: FC = () => {
  const { moreThan } = useDevice();
  const [offset, setOffset] = useState<number>(0);

  const [operationsData, loadOperations, loading] = useSubject(getOperations);

  useEffect(() => {
    loadOperations(LIMIT, offset);
  }, [offset]);

  return (
    <Flex col>
      <TableView
        itemHeight={80}
        items={operationsData?.[0] || []}
        maxHeight={464}
        tableHeaderPadding={[0, 6]}
        tableItemViewPadding={[0, 4, 0, 2]}
        gap={1}
        itemKey="id"
        emptyFilterView={<OperationSearchEmptyState />}
        expandPadding={[0, 0]}
        expand={{
          accordion: true,
          component: OperationDetails,
          height: 132,
        }}
      >
        <TableView.Column title={t`Assets`} width={218} headerWidth={202}>
          {(operationItem: OperationItem) => (
            <AssetsCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column title="Type" width={120} show={moreThan('m')}>
          {(operationItem: OperationItem) => (
            <TypeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column title="Fee" width={90} show={moreThan('m')}>
          {(operationItem: OperationItem) => (
            <FeeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column
          title={t`Date & Time`}
          width={110}
          show={moreThan('m')}
        >
          {(operationItem: OperationItem) => (
            <DateTimeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column
          title={t`Status`}
          filter={{
            render: statusFilterRender,
            onFilterChange: (filters) => console.log(filters),
          }}
        >
          {(operationItem: OperationItem) => (
            <StatusCell operationItem={operationItem} />
          )}
        </TableView.Column>

        <TableView.State condition={loading} name="loading">
          <LoadingState />
        </TableView.State>
      </TableView>
      <Flex.Item marginTop={4}>
        <OperationPagination
          onOffsetChange={setOffset}
          limit={LIMIT}
          offset={offset}
          total={operationsData?.[1] || 0}
        />
      </Flex.Item>
    </Flex>
  );
};
