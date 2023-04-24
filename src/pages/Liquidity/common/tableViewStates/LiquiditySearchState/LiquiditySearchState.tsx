import { SearchDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const LiquiditySearchState: FC = () => (
  <SearchDataState height={160}>
    <Trans>No results was found</Trans>
  </SearchDataState>
);
