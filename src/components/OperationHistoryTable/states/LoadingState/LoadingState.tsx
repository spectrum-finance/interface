import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { TableViewLoading } from '../../../TableView/states/TableViewLoadingState/TableViewLoading';

export const LoadingState: FC = () => (
  <TableViewLoading height={275}>
    <Trans>Loading your transaction history.</Trans>
    <br />
    <Trans>Please wait.</Trans>
  </TableViewLoading>
);
