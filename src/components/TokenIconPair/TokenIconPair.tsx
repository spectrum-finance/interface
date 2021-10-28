import React from 'react';

import { TokenIcon } from '../TokenIcon/TokenIcon';

export type TokenPair = { tokenA: string; tokenB: string };

interface TokenIconPairProps {
  tokenPair: TokenPair;
}

const TokenIconPair: React.FC<TokenIconPairProps> = ({ tokenPair }) => {
  const { tokenA, tokenB } = tokenPair;

  return (
    <>
      <TokenIcon name={tokenA} />
      <TokenIcon style={{ marginLeft: '-10px' }} name={tokenB} />
    </>
  );
};

export { TokenIconPair };
