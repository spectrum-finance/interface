import { ModalRef } from '@ergolabs/ui-kit';
import { ModalContent } from '@ergolabs/ui-kit/dist/components/Modal/ModalContent/ModalContent';
import { ModalTitle } from '@ergolabs/ui-kit/dist/components/Modal/ModalTitle/ModalTitle';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { LiquidityState } from '../../../../common/types/LiquidityState';

export interface LiquidityStateSelectModalProps extends ModalRef {
  readonly value: LiquidityState;
}

export const LiquidityStateSelectModal: FC<LiquidityStateSelectModalProps> = ({
  value,
  close,
}) => {
  return (
    <>
      <ModalTitle>
        <Trans>e</Trans>
      </ModalTitle>
      <ModalContent>e</ModalContent>
    </>
  );
};
