import { Flex, Input, Modal, ModalRef, SearchOutlined } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode, useState } from 'react';
import { Observable } from 'rxjs';
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
  readonly content?: ReactNode | ReactNode[] | string;
  readonly showDateTime?: boolean;
}

export const OperationHistoryModal: FC<OperationHistoryModalProps> = ({
  close,
  operationsSource,
  showDateTime,
  content,
}) => {
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
            {content && (
              <Flex.Item marginLeft={1} flex={1} justify="flex-end">
                {content}
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
