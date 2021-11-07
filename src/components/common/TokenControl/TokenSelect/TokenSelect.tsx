import './TokenSelect.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import React from 'react';

import { Button, DownOutlined, Modal } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenListModal } from './TokenListModal/TokenListModal';

interface TokenSelectProps {
  readonly asset?: AssetInfo | undefined;
  readonly onChange?: (asset: AssetInfo) => void;
  readonly assets?: AssetInfo[];
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  asset,
  onChange,
  assets,
}) => {
  const openTokenModal = () =>
    Modal.open(({ close }) => (
      <TokenListModal
        assets={assets}
        close={close}
        onSelectChanged={onChange}
      />
    ));

  return (
    <>
      {asset ? (
        <button
          className="token-select_selected"
          onClick={openTokenModal}
          style={{ width: '100%' }}
        >
          <span className="token-select_selected_container">
            <TokenIcon
              name={asset.name}
              className="token-select_selected_item"
            />
            <span className="token-select_selected_item">
              {asset.name?.toUpperCase()}
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
