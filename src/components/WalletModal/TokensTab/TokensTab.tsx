import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';
import { combineLatest, map } from 'rxjs';

import { Flex, List } from '../../../ergodex-cdk';
import { useObservable } from '../../../hooks/useObservable';
import { assets$ } from '../../../services/new/assets';
import { Balance, walletBalance$ } from '../../../services/new/balance';
import { TokenListItem } from './TokenListItem/TokenListItem';

const userAssets$ = combineLatest([assets$, walletBalance$]).pipe(
  map<[AssetInfo[], Balance], { asset: AssetInfo; balance: number }[]>(
    ([assets, balance]) =>
      assets
        .filter((a) => balance.get(a.id) > 0)
        .map((a) => ({ asset: a, balance: balance.get(a.id) })),
  ),
);

export const TokensTab: React.FC = () => {
  const [assets] = useObservable(userAssets$);

  return (
    <Flex direction="col">
      <Flex.Item marginTop={2}>
        <List rowKey="id" dataSource={assets} height={224} transparent gap={2}>
          {(item) => (
            <TokenListItem balance={item.balance} asset={item.asset} />
          )}
        </List>
      </Flex.Item>
    </Flex>
  );
};
