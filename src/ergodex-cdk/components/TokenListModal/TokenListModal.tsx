import './TokenListModal.less';

import React, { useState } from 'react';

import { Input, SearchOutlined } from '../index';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  close?: () => void;
  onSelectChanged?: (name: string) => void | undefined;
}

const tokenList = [
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
];

const TokenListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
}) => {
  const [searchWords, setSearchWords] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const handleClick = (symbol: string) => {
    if (onSelectChanged) {
      onSelectChanged(symbol);
    }

    if (close) {
      close();
    }
  };

  return (
    <div className="token-list-modal">
      <Input
        placeholder="Search"
        size="large"
        prefix={<SearchOutlined />}
        onChange={handleSearch}
      />
      <div className="token-list">
        {tokenList
          .filter((token) => {
            return token.symbol
              .toLowerCase()
              .includes(searchWords.toLowerCase());
          })
          .map((token, key) => (
            <TokenListItem
              key={key}
              symbol={token.symbol}
              name={token.name}
              iconName={token.iconName}
              balance={0.01342}
              onClick={() => handleClick(token.symbol)}
            />
          ))}
      </div>
    </div>
  );
};

export { TokenListModal };
