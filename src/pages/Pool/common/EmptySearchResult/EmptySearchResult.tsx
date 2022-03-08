import React, { FC } from 'react';

import { PositionListEmptyTemplate } from '../EmptyTemplateContainer/PositionListEmptyTemplate';

export const EmptySearchResult: FC = () => (
  <PositionListEmptyTemplate>No results found</PositionListEmptyTemplate>
);
