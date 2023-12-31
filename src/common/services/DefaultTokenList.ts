import axios from 'axios';
import { from, map, Observable, publishReplay, refCount } from 'rxjs';

export interface DefaultTokenList<T> {
  readonly network: string;
  readonly tokens: T[];
  readonly tokensMap: Map<string, T>;
}

export const getDefaultTokenList = <T>(
  url: string,
  getHash: (item: T) => string,
  additionalTokens: T[] = [],
): Observable<DefaultTokenList<T>> =>
  from(axios.get(url)).pipe(
    map((res) => res.data),
    map((data: DefaultTokenList<T>) => ({
      ...data,
      tokens: data.tokens.concat(additionalTokens),
      tokensMap: data.tokens
        .concat(additionalTokens)
        .reduce<Map<string, T>>((map, item) => {
          map.set(getHash(item), item);

          return map;
        }, new Map()),
    })),
    publishReplay(1),
    refCount(),
  );
