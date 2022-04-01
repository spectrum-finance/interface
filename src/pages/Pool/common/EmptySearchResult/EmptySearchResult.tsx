import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { PositionListEmptyTemplate } from '../EmptyTemplateContainer/PositionListEmptyTemplate';

export const EmptySearchResult: FC = () => (
  <PositionListEmptyTemplate>
    <Trans>No results found</Trans>
  </PositionListEmptyTemplate>
);
