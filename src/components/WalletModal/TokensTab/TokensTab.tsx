import React from 'react';

import { Flex, List } from '../../../ergodex-cdk';
import { useWalletBalance } from '../../../services/new/balance';
import { TokenListItem } from './TokenListItem/TokenListItem';

export const TokensTab: React.FC = () => {
  const [balance] = useWalletBalance();

  return (
    <Flex direction="col">
      <Flex.Item marginTop={2}>
        <List
          rowKey="id"
          dataSource={balance.values()}
          height={224}
          transparent
          gap={2}
        >
          {(item) => <TokenListItem currency={item} />}
        </List>
      </Flex.Item>
    </Flex>
  );
};
