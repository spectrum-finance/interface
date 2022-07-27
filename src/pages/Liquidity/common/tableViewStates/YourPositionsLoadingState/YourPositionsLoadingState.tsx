import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

export const YourPositionsLoadingState: FC = () => (
  <LoadingDataState height={160}>
    <Trans>Loading positions history.</Trans>
    <br />
    <Trans>Please wait.</Trans>
  </LoadingDataState>
);
