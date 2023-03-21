import { Modal, ModalRef } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useSettings } from '../../gateway/settings/settings';
import { OperationHistoryV1 } from './OperationHistoryV1/OperationHistoryV1';
import { OperationHistoryV2 } from './OperationHistoryV2/OperationHistoryV2';

export interface OperationHistoryModalProps extends ModalRef {
  readonly showDateTime?: boolean;
}

export const OperationHistoryModal: FC<OperationHistoryModalProps> = ({
  close,
  showDateTime,
}) => {
  const { newHistory } = useSettings();

  return (
    <>
      <Modal.Title>
        <Trans>Orders history</Trans>
      </Modal.Title>
      <Modal.Content width={newHistory ? 740 : 772}>
        {newHistory ? (
          <OperationHistoryV2 close={close} />
        ) : (
          <OperationHistoryV1 close={close} showDateTime={showDateTime} />
        )}
      </Modal.Content>
    </>
  );
};
