import { Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../../common/hooks/useObservable';
import { filterOperations } from '../../../common/models/Operation';
import {
  DialogRef,
  Flex,
  Input,
  Modal,
  SearchOutlined,
} from '../../../ergodex-cdk';
import { getTransactionHistory } from '../../../network/cardano/api/transactionHistory/transactionHistory';
import { OperationHistoryTable } from '../../OperationHistoryTable/OperationHistoryTable';

const SearchInput = styled(Input)`
  width: 320px;
`;

export const CardanoTxHistory: FC<DialogRef> = ({ close }) => {
  const [operations, loading] = useObservable(getTransactionHistory(), []);
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
          <Flex.Item marginBottom={4}>
            <SearchInput
              onChange={(e) => setTerm(e.target.value)}
              prefix={<SearchOutlined />}
              placeholder="Search"
            />
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
