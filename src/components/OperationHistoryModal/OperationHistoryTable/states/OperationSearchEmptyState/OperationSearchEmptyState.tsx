import { SearchDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

export const OperationSearchEmptyState: FC = () => (
  <SearchDataState height={275}>
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <Trans>We didn't find anything.</Trans>
    <br />
    <Trans>Try something else.</Trans>
  </SearchDataState>
);
