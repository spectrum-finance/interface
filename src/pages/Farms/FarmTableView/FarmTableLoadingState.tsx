import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const FarmTableLoadingState: FC = () => {
  return (
    <LoadingDataState height={160}>
      <Trans>Loading farms.</Trans>
      <br />
      <Trans>Please wait.</Trans>
    </LoadingDataState>
  );
};
