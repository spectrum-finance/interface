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
        <button
          className="token-select_selected"
          onClick={openTokenModal}
          style={{ width: '100%' }}
        >
          <span className="token-select_selected_container">
            <TokenIcon name={name} className="token-select_selected_item" />
            <span className="token-select_selected_item">
              {name.toUpperCase()}
            </span>
            <DownOutlined />
          </span>
        </button>
      ) : (
        <Button
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          size="large"
          type="primary"
          onClick={openTokenModal}
          block
        >
          Select a token
          <DownOutlined />
        </Button>
      )}
    </>
  );
};

export { TokenSelect };
