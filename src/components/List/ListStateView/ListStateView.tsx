import { FC, useEffect } from 'react';

import { ListState } from '../common/ListState';
import { useListContext } from '../ListContext/ListContext';

export const ListStateView: FC<ListState> = (state) => {
  const { addState } = useListContext();

  useEffect(() => {
    addState(state);
  }, [state.condition]);

  return null;
};
