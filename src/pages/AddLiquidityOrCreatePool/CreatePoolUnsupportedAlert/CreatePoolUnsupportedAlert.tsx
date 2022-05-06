import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { IsCardano } from '../../../components/IsCardano/IsCardano';
import { IsErgo } from '../../../components/IsErgo/IsErgo';
import { Alert } from '../../../ergodex-cdk';

export interface CreatePoolUnsupportedAlertProps {
  readonly walletName: string;
}

export const CreatePoolUnsupportedAlert: FC<CreatePoolUnsupportedAlertProps> =
  ({ walletName }) => (
    <>
      <IsErgo>
        <Alert
          type="warning"
          description={t`${walletName} Wallet doesn’t support “create pool” functionality yet. Choose another wallet to perform the operation.`}
        />
      </IsErgo>
      <IsCardano>
        <Alert
          type="warning"
          description={t`Testnet user interface doesn’t support “create pool” functionality.`}
        />
      </IsCardano>
    </>
  );
