import {
  ParamKeyValuePair,
  useSearchParams as useRouterSearchParams,
} from 'react-router-dom';

const transformMapToObject = <T extends Record<string, string | undefined>>(
  map: URLSearchParams,
) =>
  Array.from(map.entries()).reduce<T>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {} as any,
  );

const transformObjectToKeyValueParam = <
  T extends Record<string, string | undefined>,
>(
  p: T,
): ParamKeyValuePair[] =>
  Object.entries(p).filter(
    ([_, value]) => value !== undefined,
  ) as ParamKeyValuePair[];

type SetSearchParamsFn<T extends Record<string, string | undefined>> = (
  pt: Partial<T>,
  config?: { replace?: boolean; merge?: boolean },
) => void;

export const useSearchParams = <
  SP extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): [SP, SetSearchParamsFn<SP>] => {
  const [searchParams, _setSearchParams] = useRouterSearchParams();
  const transformedSearchParams: SP = transformMapToObject(searchParams);

  const setSearchParams: SetSearchParamsFn<SP> = (p, config = {}) => {
    const normalizedConfig = {
      merge: config?.merge || true,
      replace: config?.replace || true,
    };

    _setSearchParams(
      transformObjectToKeyValueParam(
        normalizedConfig.merge ? { ...transformedSearchParams, ...p } : p,
      ),
      { replace: normalizedConfig.replace },
    );
  };

  return [transformedSearchParams, setSearchParams];
};
