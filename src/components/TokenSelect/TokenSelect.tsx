import './TokenSelect.less';

import React from 'react';

import { Button, DownOutlined } from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

interface TokenSelectProps {
  name?: string | null;
  onTokenSelect?: React.MouseEventHandler<HTMLElement>;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ name, onTokenSelect }) => (
  <>
    {name ? (
      <button className="token-select_selected" onClick={onTokenSelect}>
        <span className="token-select_selected_container">
          <TokenIcon
            name={name ?? 'empty'}
            className="token-select_selected_item"
          />
          <span className="token-select_selected_item">
            {name.toUpperCase()}
          </span>
          <DownOutlined />
        </span>
      </button>
    ) : (
      <Button
        className="token-select"
        size="large"
        type="primary"
        onClick={onTokenSelect}
      >
        Select a token
        <DownOutlined />
      </Button>
    )}
  </>
);

export { TokenSelect };
