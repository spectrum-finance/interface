import React from 'react';

import { Flex, List } from '../../../ergodex-cdk';
import { useAssetsBalance } from '../../../gateway/assetBalance';
import { TokenListItem } from './TokenListItem/TokenListItem';

export const TokensTab: React.FC = () => {
  const [balance] = useAssetsBalance();

  return (
    <Flex direction="col">
      <Flex.Item marginTop={2}>
        <List
          rowKey="id"
          dataSource={balance.values().filter((b) => b.isPositive())}
          height={224}
          gap={2}
        >
          {(item) => <TokenListItem currency={item} />}
        </List>
      </Flex.Item>
    </Flex>
  );
};
