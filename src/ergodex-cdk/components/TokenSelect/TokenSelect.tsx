import './TokenSelect.less';

import React from 'react';

import { Button, DownOutlined, TokenIcon } from '../index';

interface TokenSelectProps {
  name?: string | null;
  onTokenSelect?: React.MouseEventHandler<HTMLElement>;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ name, onTokenSelect }) => (
  <>
    {name ? (
      <button className="token-select" onClick={onTokenSelect}>
        <span className="token-select_container">
          <TokenIcon name={name ?? 'empty'} className="token-select_item" />
          <span className="token-select_item">{name.toUpperCase()}</span>
          <DownOutlined />
        </span>
      </button>
    ) : (
      <Button size="large" type="primary" onClick={onTokenSelect}>
        Select a token
        <DownOutlined />
      </Button>
    )}
  </>
);

export { TokenSelect };
