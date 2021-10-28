import React from 'react';

import { Modal } from '../../ergodex-cdk';
import { ChooseWalletModal } from './ChooseWalletModal';

export const openChooseWalletModal = (): void => {
  Modal.open(({ close }) => <ChooseWalletModal close={close} />, {
    width: 372,
    title: 'Select a wallet',
  });
};
