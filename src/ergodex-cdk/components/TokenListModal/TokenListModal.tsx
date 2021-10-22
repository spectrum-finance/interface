import './TokenListModal.less';

import React, { useState } from 'react';

import { Input, Modal, SearchOutlined } from '../index';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  visible: boolean;
  onCancel?: () => void;
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
  visible,
  onCancel,
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
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      className="token-list-modal light"
      visible={visible}
      title="Select a token"
      footer={null}
      onCancel={onCancel}
    >
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
    </Modal>
  );
};

export { TokenListModal };
