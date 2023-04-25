import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const LoadingState: FC<{ height?: number }> = ({ height = 275 }) => (
  <LoadingDataState height={height}>
    <Trans>Loading your transaction history.</Trans>
    <br />
    <Trans>Please wait.</Trans>
  </LoadingDataState>
);
