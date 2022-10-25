import { Flex, LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';

import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { List } from '../../List/List';
import { ListStateView } from '../../List/ListStateView/ListStateView';
import { TokenListItem } from './TokenListItem/TokenListItem';

export const TokensTab: React.FC = () => {
  const [balance, loading] = useAssetsBalance();

  return (
    <Flex col>
      <List
        itemKey={(item) => item.asset.id}
        items={balance.values().filter((b) => b.isPositive())}
        maxHeight={268}
        itemHeight={64}
        gap={1}
      >
        {({ item }) => <TokenListItem currency={item} />}
        <ListStateView name="loading" condition={loading}>
          <LoadingDataState height={250} transparent={true}>
            <Trans>Loading balance</Trans>
          </LoadingDataState>
        </ListStateView>
      </List>
    </Flex>
  );
};
