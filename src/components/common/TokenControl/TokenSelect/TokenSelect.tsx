import './TokenSelect.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import React from 'react';

import { Button, DownOutlined, Form, Modal } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenListModal } from './TokenListModal/TokenListModal';

interface TokenSelectProps {
  readonly value?: AssetInfo | undefined;
  readonly onChange?: (value: AssetInfo) => void;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  value,
  onChange,
  assets,
  disabled,
  readonly,
}) => {
  const openTokenModal = () => {
    if (readonly) {
      return;
    }
    Modal.open(
      ({ close }) => (
        <TokenListModal
          assets={assets}
          close={close}
          onSelectChanged={onChange}
        />
      ),
      { title: 'Select a token', width: 352 },
    );
  };

  return (
    <>
      {value ? (
        <button
          className="token-select__selected"
          onClick={openTokenModal}
          disabled={disabled}
        >
          <span className="token-select__selected-container">
            <span className="token-select__selected-inner token-select__selected-item">
              <TokenIcon
                name={value.name}
                className="token-select__selected-item"
              />
              <span>{value.name}</span>
            </span>
            {!readonly && <DownOutlined />}
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
          disabled={disabled}
        >
          Select a token
          {!readonly && <DownOutlined />}
        </Button>
      )}
    </>
  );
};

interface TokeSelectFormItem extends TokenSelectProps {
  name?: string;
}

const TokeSelectFormItem: React.FC<TokeSelectFormItem> = ({
  name,
  ...rest
}) => {
  return (
    <Form.Item name={name} className="token-select-form-item">
      <TokenSelect {...rest} />
    </Form.Item>
  );
};

export { TokenSelect, TokeSelectFormItem };
