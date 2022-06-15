import { useParams } from 'react-router-dom';

export const useParamsStrict = <
  T extends Record<string, unknown> | string = string,
>(): T => useParams() as T;
