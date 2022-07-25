import { Alert, Button, Flex } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { Operation } from '../../../../../common/models/Operation';
import { addresses$ } from '../../../../../gateway/api/addresses';
import { RefundConfirmationModal } from '../../../../common/TxHistory/RefundConfirmationModal/RefundConfirmationModal';
import {
  openConfirmationModal,
  Operation as ConfirmationOperation,
} from '../../../../ConfirmationModal/ConfirmationModal';
import { OperationHistoryTable } from '../../../../OperationHistoryModal/OperationHistoryTable/OperationHistoryTable';
import { Section } from '../../../../Section/Section';

export interface TransactionInfoProps {
  operation?: Operation;
  errorMessage?: string;
  close: (result: boolean) => void;
}

export const TransactionInfo: FC<TransactionInfoProps> = ({
  operation,
  errorMessage,
  close,
}) => {
  const [addresses, addressesLoading] = useObservable(addresses$);

  const handleOpenRefundConfirmationModal = (operation: Operation) => {
    if (addresses) {
      const payload =
        operation.type === 'swap'
          ? { xAsset: operation.base, yAsset: operation.quote }
          : { xAsset: operation.x, yAsset: operation.y };

      close(true);
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
    }
  };

  return (
    <Section title={t`Transaction info`}>
      {!!errorMessage && <Alert showIcon type="error" message={errorMessage} />}
      {!errorMessage && !!operation && (
        <Flex col>
          <Flex.Item marginBottom={6}>
            <OperationHistoryTable
              addresses={[]}
              emptyOperations={false}
              emptySearch={false}
              hideActions
              hideHeader
              showDateTime
              operations={[operation]}
              loading={false}
              close={() => {}}
            />
          </Flex.Item>
          <Button
            type="primary"
            size="large"
            loading={addressesLoading}
            onClick={() => handleOpenRefundConfirmationModal(operation)}
          >
            <Trans>Refund Transaction</Trans>
          </Button>
        </Flex>
      )}
    </Section>
  );
};
