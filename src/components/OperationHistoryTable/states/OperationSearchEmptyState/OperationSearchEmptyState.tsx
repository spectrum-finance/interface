import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { TableViewEmptySearchState } from '../../../TableView/states/TableViewEmptySearchState/TableViewEmptySearchState';

export const OperationSearchEmptyState: FC = () => (
  <TableViewEmptySearchState height={275}>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <Trans>We didn't find anything. Try something else.</Trans>
  </TableViewEmptySearchState>
);
