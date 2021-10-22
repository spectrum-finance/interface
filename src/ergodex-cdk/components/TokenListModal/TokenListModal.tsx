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
    symbol: 'ERGX',
    name: 'ErgoDEX',
    iconName: 'ergx-orange',
  },
  {
    symbol: 'WBTC',
    name: 'WrappedBTC',
  },
  {
    symbol: '1INCH',
    name: '1Inch',
  },
  {
    symbol: 'AAVE',
    name: 'AaveToken',
  },
  {
    symbol: 'AMP',
    name: 'Amp',
  },
  {
    symbol: 'ANT',
    name: 'Aragon Network Token',
  },
  {
    symbol: 'BAL',
    name: 'Balancer',
  },
  {
    symbol: 'BAND',
    name: 'Band Protocol',
  },
  {
    symbol: 'BAT',
    name: 'BasicAttentionToken',
  },
];

const TokenListModal: React.FC<TokenListModalProps> = ({
  visible,
  onCancel,
  onSelectChanged,
}) => {
  const [searchWords, setSearchWords] = useState('');

  const handleSearch = (e: any) => {
    setSearchWords(e.target.value);
  };

  const handleClick = (token: any) => {
    if (onSelectChanged) {
      onSelectChanged(token.symbol);
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
              onClick={() => handleClick(token)}
            />
          ))}
      </div>
    </Modal>
  );
};

export { TokenListModal };
