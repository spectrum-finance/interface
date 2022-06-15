import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode, useState } from 'react';
import { Observable } from 'rxjs';
import styled from 'styled-components';

import { useObservable } from '../../common/hooks/useObservable';
import { filterOperations, Operation } from '../../common/models/Operation';
import {
  Flex,
  Input,
  Modal,
  ModalRef,
  SearchOutlined,
} from '../../ergodex-cdk';
import { OperationHistoryTable } from './OperationHistoryTable/OperationHistoryTable';

const SearchInput = styled(Input)`
  width: 320px;
`;

export interface OperationHistoryModalProps extends ModalRef {
  readonly operationsSource:
    | Observable<Operation[]>
    | (() => Observable<Operation[]>);
  readonly content?: ReactNode | ReactNode[] | string;
}

export const OperationHistoryModal: FC<OperationHistoryModalProps> = ({
  close,
  operationsSource,
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
              onChange={(e) => setTerm(e.target.value)}
              prefix={<SearchOutlined />}
              placeholder={t`Search`}
            />
            <Flex.Item marginLeft={1} flex={1} justify="flex-end">
              {content}
            </Flex.Item>
          </Flex.Item>
          <OperationHistoryTable
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
