import React from 'react';

import { Flex } from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

export type TokenPair = { tokenA?: string; tokenB?: string };

interface TokenIconPairProps {
  tokenPair: TokenPair;
}

const TokenIconPair: React.FC<TokenIconPairProps> = ({ tokenPair }) => {
  const { tokenA, tokenB } = tokenPair;

  return (
    <Flex>
      <TokenIcon name={tokenA} />
      <TokenIcon style={{ marginLeft: '-10px' }} name={tokenB} />
    </Flex>
  );
};

export { TokenIconPair };
