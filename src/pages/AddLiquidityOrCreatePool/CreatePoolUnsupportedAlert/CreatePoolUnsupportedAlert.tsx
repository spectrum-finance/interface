import { Alert } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { IsErgo } from '../../../components/IsErgo/IsErgo';

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
    </>
  );
