import axios from 'axios';
import { from, map, Observable, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { uint } from '../types';

export interface DefaultTokenListItem {
  readonly address: string;
  readonly decimals: uint;
  readonly name: string;
  readonly ticker: string;
  readonly logoURI?: string;
}

export interface DefaultTokenList {
  readonly network: string;
  readonly tokens: DefaultTokenListItem[];
  readonly tokensMap: Map<string, DefaultTokenListItem>;
}

export const getDefaultTokenList = (
  network: string,
): Observable<DefaultTokenList> =>
  from(
    axios.get(`${applicationConfig.defaultTokenListUrl}/${network}.json`),
  ).pipe(
    map((res) => res.data),
    map((data: DefaultTokenList) => ({
      ...data,
      tokensMap: data.tokens.reduce<Map<string, DefaultTokenListItem>>(
        (map, item) => {
          map.set(item.address, item);

          return map;
        },
        new Map(),
      ),
    })),
    publishReplay(1),
    refCount(),
  );
