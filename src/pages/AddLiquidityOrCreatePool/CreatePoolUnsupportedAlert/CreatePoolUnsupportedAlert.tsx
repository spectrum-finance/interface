import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { Alert } from '../../../ergodex-cdk';

export interface CreatePoolUnsupportedAlertProps {
  readonly walletName: string;
}

export const CreatePoolUnsupportedAlert: FC<CreatePoolUnsupportedAlertProps> =
  ({ walletName }) => (
    <Alert
      type="warning"
      description={t`${walletName} Wallet doesn’t support “create pool” functionality yet. Choose another wallet to perform the operation.`}
    />
  );
