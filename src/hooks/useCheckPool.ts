import { AmmPool, OK } from '@ergolabs/ergo-dex-sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { checkPool } from '../utils/checkPool';

type FetchState = {
  isFetching: boolean;
  result: null | boolean;
  errors: null | string;
};

const defaultState = {
  isFetching: false,
  result: null,
  errors: null,
};

export const useCheckPool = (pool: AmmPool | undefined): FetchState => {
  const [state, setState] = useState<FetchState>(defaultState);

  useEffect(() => {
    if (pool) {
      setState({
        ...defaultState,
        isFetching: true,
      });
      checkPool(pool)
        .then((result) => {
          setState({
            ...defaultState,
            isFetching: false,
            result: result === OK,
          });
        })
        // TODO:
        .catch(() => {
          toast.error('Pool validation error');
          setState({
            ...defaultState,
            isFetching: false,
            errors: 'Pool validation error',
          });
        });
    }
  }, [pool]);

  return state;
};
