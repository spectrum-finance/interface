import { Flex, ModalRef, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';

import { useSubject } from '../../../common/hooks/useObservable';
import { OperationItem } from '../../../common/models/OperationV2';
import { getOperations } from '../../../gateway/api/transactionsHistory';
import { CopyButton } from '../../common/CopyButton/CopyButton.tsx';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton.tsx';
import { ListSkeletonLoadingState } from '../../SkeletonLoader/ListSkeletonLoadingState.tsx';
import { TableView } from '../../TableView/TableView';
import { AssetsCell } from './cells/AssetsCell/AssetsCell';
import { CancelOrderCell } from './cells/CancelOrderCell/CancelOrderCell.tsx';
import { DateTimeCell } from './cells/DateTimeCell/DateTimeCell';
import { FeeCell } from './cells/FeeCell/FeeCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { TypeCell } from './cells/TypeCell/TypeCell';
import styles from './OperationHistory.module.less';
import { OperationPagination } from './OperationPagination/OperationPagination';
import { ErrorState } from './states/ErrorState/ErrorState';
import { OperationSearchEmptyState } from './states/OperationSearchEmptyState/OperationSearchEmptyState';
import { OperationsEmptyState } from './states/OperationsEmptyState/OperationsEmptyState';

const LIMIT = 25;

export const OperationHistoryV2: FC<ModalRef> = ({ close }) => {
  const { moreThan } = useDevice();
  const [offset, setOffset] = useState<number>(0);

  const [operationsData, loadOperations, loading, error] =
    useSubject(getOperations);

  useEffect(() => {
    loadOperations(LIMIT, offset);
  }, [offset]);

  const reloadOperations = () => loadOperations(LIMIT, offset);

  const { s } = useDevice();

  return (
    <Flex col>
      <Flex col className={styles.OperationHistory}>
        <TableView
          itemHeight={s ? 108 : 80}
          items={operationsData?.[0] || []}
          maxHeight={464}
          tableHeaderPadding={[0, 2]}
          tableItemViewPadding={[0, 2, 0, 2]}
          gap={1}
          itemKey="id"
          emptyFilterView={<OperationSearchEmptyState />}
          expandPadding={[0, 0]}
        >
          <TableView.Column title={t`Assets`} width={220} headerWidth={220}>
            {(operationItem: OperationItem) => (
              <AssetsCell operationItem={operationItem} />
            )}
          </TableView.Column>
          <TableView.Column title="Type" width={110} show={moreThan('m')}>
            {(operationItem: OperationItem) => (
              <TypeCell operationItem={operationItem} />
            )}
          </TableView.Column>
          <TableView.Column title="Fee" width={100} show={moreThan('m')}>
            {(operationItem: OperationItem) => (
              <FeeCell operationItem={operationItem} />
            )}
          </TableView.Column>
          <TableView.Column
            title={t`Date & Time`}
            width={100}
            show={moreThan('l')}
          >
            {(operationItem: OperationItem) => (
              <DateTimeCell operationItem={operationItem} />
            )}
          </TableView.Column>
          <TableView.Column title={t`Status`} width={100} show={moreThan('m')}>
            {(operationItem: OperationItem) => (
              <StatusCell operationItem={operationItem} />
            )}
          </TableView.Column>
          <TableView.Column title={t`Actions`} width={60} show={moreThan('m')}>
            {(operationItem: OperationItem) => (
              <Flex align="center" justify="center" gap={1}>
                <Flex.Item>
                  <ExploreButton
                    to={operationItem.registerTx.id}
                    size="small"
                  />
                </Flex.Item>
                <CopyButton
                  tooltipText={t`Copy Transaction ID`}
                  messageContent={t`TxId successfully copied`}
                  text={operationItem.registerTx.id}
                  size="small"
                />
              </Flex>
            )}
          </TableView.Column>
          <TableView.Column show={moreThan('m')} width={80}>
            {(operationItem: OperationItem) => (
              <CancelOrderCell operationItem={operationItem} />
            )}
          </TableView.Column>

          {s && (
            <TableView.Column>
              {(operationItem: OperationItem) => (
                <Flex col align="center">
                  <Flex.Item marginBottom={2}>
                    <StatusCell operationItem={operationItem} />
                  </Flex.Item>
                  <Flex.Item marginBottom={0}>
                    <Flex>
                      <Flex.Item marginRight={2}>
                        <ExploreButton
                          to={operationItem.registerTx.id}
                          size="small"
                        />
                      </Flex.Item>
                      <CopyButton
                        tooltipText={t`Copy Transaction ID`}
                        messageContent={t`TxId successfully copied`}
                        text={operationItem.registerTx.id}
                        size="small"
                      />
                    </Flex>
                  </Flex.Item>

                  <CancelOrderCell operationItem={operationItem} />
                </Flex>
              )}
            </TableView.Column>
          )}

          <TableView.State condition={loading} name="loading">
            <ListSkeletonLoadingState numOfElements={5} />
          </TableView.State>
          <TableView.State
            condition={!loading && !error && !operationsData?.[1]}
            name="empty"
          >
            <OperationsEmptyState onSwapNowButtonClick={close} height={420} />
          </TableView.State>
          <TableView.State condition={!loading && !!error} name="error">
            <ErrorState onReloadClick={reloadOperations} />
          </TableView.State>
        </TableView>
        {operationsData?.[1] ? (
          <Flex.Item marginTop={4}>
            <OperationPagination
              onOffsetChange={setOffset}
              limit={LIMIT}
              offset={offset}
              total={operationsData?.[1] || 0}
            />
          </Flex.Item>
        ) : (
          ''
        )}
      </Flex>
    </Flex>
  );
};
