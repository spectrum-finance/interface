import { AmmPool, OK } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { checkPool } from '../utils/checkPool';
const defaultState = {
  isFetching: false,
  result: null,
  errors: null,
};
export const useCheckPool = (pool: AmmPool | undefined) => {
  const [state, setState] = useState<{
    isFetching: boolean;
    result: null | boolean;
    errors: null | string;
  }>(defaultState);

  useEffect(() => {
    if (pool) {
      setState({
        ...defaultState,
        isFetching: true,
      });
      checkPool(pool)
        .then((result) => {
          console.log(result);
          setState({
            ...defaultState,
            isFetching: false,
            result: result === OK,
          });
        })
        // TODO:
        .catch((er) => {
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
