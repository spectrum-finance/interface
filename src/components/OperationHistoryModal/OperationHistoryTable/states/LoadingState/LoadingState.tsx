import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

export const LoadingState: FC = () => (
  <LoadingDataState height={275}>
    <Trans>Loading your transaction history.</Trans>
    <br />
    <Trans>Please wait.</Trans>
  </LoadingDataState>
);
