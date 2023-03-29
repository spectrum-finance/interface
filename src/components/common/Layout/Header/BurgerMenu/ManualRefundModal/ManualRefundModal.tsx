import { ModalRef } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { useSettings } from '../../../../../../gateway/settings/settings';
import { ManualRefundModalV1 } from './ManualRefundModalV1/ManualRefundModalV1';
import { ManualRefundModalV2 } from './ManualRefundModalV2/ManualRefundModalV2';

export const ManualRefundModal: FC<ModalRef> = ({ close }) => {
  const { newHistory } = useSettings();

  return newHistory ? (
    <ManualRefundModalV2 close={close} />
  ) : (
    <ManualRefundModalV1 close={close} />
  );
};
