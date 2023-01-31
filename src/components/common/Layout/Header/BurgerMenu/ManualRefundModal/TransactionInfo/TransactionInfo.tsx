import { Alert, Button, Flex } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { first } from 'rxjs';

import { useObservable } from '../../../../../../../common/hooks/useObservable';
import { Operation } from '../../../../../../../common/models/Operation';
import { addresses$ } from '../../../../../../../gateway/api/addresses';
import { refund } from '../../../../../../../gateway/api/operations/refund';
import { OperationHistoryTable } from '../../../../../../OperationHistoryModal/OperationHistoryTable/OperationHistoryTable';
import { Section } from '../../../../../../Section/Section';

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
      refund(addresses, operation, payload.xAsset, payload.yAsset)
        .pipe(first())
        .subscribe();
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
