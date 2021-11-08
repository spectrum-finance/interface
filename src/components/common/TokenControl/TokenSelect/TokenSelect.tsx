import './TokenSelect.less';

import { AssetAmount, AssetInfo } from '@ergolabs/ergo-sdk';
import React from 'react';

import { Button, DownOutlined, Modal } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenListModal } from './TokenListModal/TokenListModal';

interface TokenSelectProps {
  readonly asset?: AssetInfo | undefined;
  readonly onChange?: (asset: AssetInfo) => void;
  readonly assets?: AssetInfo[];
  readonly readonly?: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  asset,
  onChange,
  assets,
  readonly,
}) => {
  const openTokenModal = () => {
    if (readonly) {
      return;
    }
    Modal.open(({ close }) => (
      <TokenListModal
        assets={assets}
        close={close}
        onSelectChanged={onChange}
      />
    ));
  };

  return (
    <>
      {asset ? (
        <button className="token-select_selected" onClick={openTokenModal}>
          <span className="token-select_selected_container">
            <TokenIcon
              name={asset.name ?? 'empty'}
              className="token-select_selected_item"
            />
            <span className="token-select_selected_item">
              {asset.name?.toUpperCase()}
            </span>
            {!readonly && <DownOutlined />}
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
          {!readonly && <DownOutlined />}
        </Button>
      )}
    </>
  );
};

export { TokenSelect };
