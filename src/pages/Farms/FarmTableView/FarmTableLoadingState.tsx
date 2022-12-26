import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

export const FarmTableLoadingState = () => {
  return (
    <LoadingDataState height={160}>
      <Trans>Loading pools.</Trans>
      <br />
      <Trans>Please wait.</Trans>
    </LoadingDataState>
  );
};
