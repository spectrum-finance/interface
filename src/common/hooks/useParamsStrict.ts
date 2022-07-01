import { useParams } from 'react-router-dom';

export const useParamsStrict = <
  P extends Record<string, unknown> | string = string,
>(): P => useParams() as P;
