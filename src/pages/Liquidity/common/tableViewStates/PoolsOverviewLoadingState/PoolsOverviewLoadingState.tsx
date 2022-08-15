import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

export const PoolsOverviewLoadingState: FC = () => (
  <LoadingDataState height={160}>
    <Trans>Loading pools.</Trans>
    <br />
    <Trans>Please wait.</Trans>
  </LoadingDataState>
);
