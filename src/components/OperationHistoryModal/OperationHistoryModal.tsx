import { Flex, Modal, ModalRef, Switch, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { OperationHistoryV1 } from './OperationHistoryV1/OperationHistoryV1';
import { OperationHistoryModalHeader } from './OperationHistroryModalHeader/OperationHistoryModalHeader';

export interface OperationHistoryModalProps extends ModalRef {
  readonly showDateTime?: boolean;
}

export const OperationHistoryModal: FC<OperationHistoryModalProps> = ({
  close,
  showDateTime,
}) => {
  return (
    <>
      <Modal.Title>
        <OperationHistoryModalHeader />
      </Modal.Title>
      <Modal.Content width={772}>
        <OperationHistoryV1 close={close} showDateTime={showDateTime} />
      </Modal.Content>
    </>
  );
};
