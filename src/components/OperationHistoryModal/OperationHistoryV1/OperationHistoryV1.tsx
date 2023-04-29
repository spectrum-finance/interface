import {
  Button,
  Flex,
  Input,
  ModalRef,
  ReloadOutlined,
  SearchOutlined,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { filterOperations } from '../../../common/models/Operation';
import {
  getOperations,
  getSyncOperationsFunction,
  isOperationsSyncing$,
} from '../../../gateway/api/transactionsHistory';
import { OperationHistoryTable } from './OperationHistoryTable/OperationHistoryTable';

const SearchInput = styled(Input)`
  width: 320px;
`;

export interface OperationHistoryV1Props extends ModalRef {
  readonly showDateTime?: boolean;
}

export const OperationHistoryV1: FC<OperationHistoryV1Props> = ({ close }) => {
  const [operations, operationsLoading] = useObservable(getOperations(), []);
  const [isOperationsSyncing] = useObservable(isOperationsSyncing$);
  const [syncOperations] = useObservable(getSyncOperationsFunction());
  const [term, setTerm] = useState<string | undefined>();

  const filteredOperations = operations
    ? filterOperations(operations, term)
    : [];

  return (
    <Flex col>
      <Flex.Item marginTop={2} marginBottom={4} display="flex" align="center">
        <SearchInput
          size="large"
          onChange={(e) => setTerm(e.target.value)}
          prefix={<SearchOutlined />}
          placeholder={t`Search`}
        />
        {syncOperations && (
          <Flex.Item marginLeft={1} flex={1} justify="flex-end">
            <Tooltip
              visible={isOperationsSyncing ? undefined : false}
              title={
                <Trans>
                  Synchronisation will continue even if you <br /> close this
                  modal window
                </Trans>
              }
            >
              <Button
                size="large"
                loading={isOperationsSyncing}
                onClick={() => syncOperations()}
                icon={<ReloadOutlined />}
              >
                {isOperationsSyncing ? t`Syncing...` : t`Sync`}
              </Button>
            </Tooltip>
          </Flex.Item>
        )}
      </Flex.Item>
      <OperationHistoryTable
        showDateTime={true}
        close={close}
        loading={operationsLoading}
        emptyOperations={!operations?.length}
        emptySearch={!filteredOperations.length}
        operations={filteredOperations}
      />
    </Flex>
  );
};
