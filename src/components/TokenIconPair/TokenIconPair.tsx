import React from 'react';

import { Flex } from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

export type TokenPair = { tokenA?: string; tokenB?: string };

interface TokenIconPairProps {
  tokenPair: TokenPair;
  size?: 'large';
}

const TokenIconPair: React.FC<TokenIconPairProps> = ({ tokenPair, size }) => {
  const { tokenA, tokenB } = tokenPair;

  return (
    <Flex align="center">
      <TokenIcon size={size} name={tokenA} />
      <TokenIcon
        size={size}
        style={{ display: 'flex', marginLeft: '-10px' }}
        name={tokenB}
      />
    </Flex>
  );
};

export { TokenIconPair };
