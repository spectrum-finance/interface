import {
  Button,
  Flex,
  Input,
  Modal,
  ModalRef,
  ReloadOutlined,
  SearchOutlined,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable, of } from 'rxjs';
import styled from 'styled-components';

import { useObservable } from '../../common/hooks/useObservable';
import { filterOperations, Operation } from '../../common/models/Operation';
import { OperationHistoryTable } from './OperationHistoryTable/OperationHistoryTable';

const SearchInput = styled(Input)`
  width: 320px;
`;

export interface OperationHistoryModalProps extends ModalRef {
  readonly operationsSource:
    | Observable<Operation[]>
    | (() => Observable<Operation[]>);
  readonly sync?: () => void;
  readonly isSyncing$?: Observable<boolean>;
  readonly showDateTime?: boolean;
}

export const OperationHistoryModal: FC<OperationHistoryModalProps> = ({
  close,
  operationsSource,
  sync,
  showDateTime,
  isSyncing$,
}) => {
  const [isSyncing] = useObservable(isSyncing$ || of(false));
  const [operations, loading] = useObservable(
    operationsSource instanceof Function
      ? operationsSource()
      : operationsSource,
    [],
  );
  const [term, setTerm] = useState<string | undefined>();

  const filteredOperations = operations
    ? filterOperations(operations, term)
    : [];

  return (
    <>
      <Modal.Title>
        <Trans>Transaction history</Trans>
      </Modal.Title>
      <Modal.Content width={772}>
        <Flex col>
          <Flex.Item marginBottom={4} display="flex" align="center">
            <SearchInput
              size="large"
              onChange={(e) => setTerm(e.target.value)}
              prefix={<SearchOutlined />}
              placeholder={t`Search`}
            />
            {sync && (
              <Flex.Item marginLeft={1} flex={1} justify="flex-end">
                <Button
                  size="large"
                  loading={isSyncing}
                  onClick={() => sync()}
                  icon={<ReloadOutlined />}
                >
                  {isSyncing ? t`Syncing...` : t`Sync`}
                </Button>
              </Flex.Item>
            )}
          </Flex.Item>
          <OperationHistoryTable
            showDateTime={showDateTime}
            close={close}
            loading={loading}
            emptyOperations={!operations?.length}
            emptySearch={!filteredOperations.length}
            operations={filteredOperations}
          />
        </Flex>
      </Modal.Content>
    </>
  );
};
