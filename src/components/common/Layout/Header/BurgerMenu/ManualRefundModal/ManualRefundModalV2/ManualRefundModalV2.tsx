import { Modal, ModalRef, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { CSSProperties, FC } from 'react';
import { first } from 'rxjs';

import { Currency } from '../../../../../../../common/models/Currency';
import { refund } from '../../../../../../../gateway/api/operations/refund';
import { TransactionFindForm } from '../common/TransactionFindForm/TransactionFindForm';

export const ManualRefundModalV2: FC<ModalRef> = ({ close }) => {
  const { valBySize } = useDevice();

  const refundOperation = (txId: string) => {
    refund(txId, new Currency(0n), new Currency(0n), true)
      .pipe(first())
      .subscribe(close);
  };

  return (
    <>
      <Modal.Title>
        <Trans>Manual refund</Trans>
      </Modal.Title>
      <Modal.Content
        width={valBySize<CSSProperties['width']>('100%', 550, 750)}
      >
        <TransactionFindForm onSubmit={refundOperation} />
      </Modal.Content>
    </>
  );
};
