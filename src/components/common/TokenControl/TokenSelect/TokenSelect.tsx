import './TokenSelect.less';

import React from 'react';

import { Button, DownOutlined, Modal } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenListModal } from './TokenListModal/TokenListModal';

interface TokenSelectProps {
  name?: string | null;
  onChange?: (token: string) => void;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ name, onChange }) => {
  const openTokenModal = () =>
    Modal.open(({ close }) => (
      <TokenListModal close={close} onSelectChanged={onChange} />
    ));

  return (
    <>
      {name ? (
        <button className="token-select_selected" onClick={openTokenModal}>
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
          onClick={openTokenModal}
        >
          Select a token
          <DownOutlined />
        </Button>
      )}
    </>
  );
};

export { TokenSelect };
