import { ModalRef } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { ManualRefundModalV2 } from './ManualRefundModalV2/ManualRefundModalV2';

export const ManualRefundModal: FC<ModalRef> = ({ close }) => {
  return <ManualRefundModalV2 close={close} />;
};
