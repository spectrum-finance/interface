import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { addresses$ } from '../../../../../api/addresses';
import { useObservable } from '../../../../../common/hooks/useObservable';
import { Alert, Button, Flex } from '../../../../../ergodex-cdk';
import { RefundConfirmationModal } from '../../../../common/TxHistory/RefundConfirmationModal/RefundConfirmationModal';
import { Operation } from '../../../../common/TxHistory/types';
import {
  openConfirmationModal,
  Operation as ConfirmationOperation,
} from '../../../../ConfirmationModal/ConfirmationModal';
import { Section } from '../../../../Section/Section';
import { OperationItemView } from '../../../common/OperationItem/OperationItemView';

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
        { xAsset: operation.assetX, yAsset: operation.assetY },
      );
    }
  };

  return (
    <Section title={t`Transaction info`}>
      {!!errorMessage && <Alert showIcon type="error" message={errorMessage} />}
      {!errorMessage && !!operation && (
        <Flex col>
          <Flex.Item marginBottom={6}>
            <OperationItemView operation={operation} />
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
