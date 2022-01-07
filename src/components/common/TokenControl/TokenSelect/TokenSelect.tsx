import './TokenSelect.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import React from 'react';
import { Observable } from 'rxjs';

import {
  Button,
  DownOutlined,
  Modal,
  Typography,
} from '../../../../ergodex-cdk';
import { Form } from '../../../../ergodex-cdk/components/Form/NewForm';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenListModal } from './TokenListModal/TokenListModal';

interface TokenSelectProps {
  readonly value?: AssetInfo | undefined;
  readonly onChange?: (value: AssetInfo) => void;
  readonly assets?: AssetInfo[];
  readonly assets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  value,
  onChange,
  assets,
  disabled,
  readonly,
  assets$,
}) => {
  const handleSelectChange = (newValue: AssetInfo): void => {
    if (value?.id !== newValue?.id && onChange) {
      onChange(newValue);
    }
  };

  const openTokenModal = () => {
    if (readonly) {
      return;
    }
    Modal.open(({ close }) => (
      <TokenListModal
        assets$={assets$}
        assets={assets}
        close={close}
        onSelectChanged={handleSelectChange}
      />
    ));
  };

  return (
    <>
      {value ? (
        <Button
          type="ghost"
          size="large"
          className="token-select__selected"
          onClick={openTokenModal}
          disabled={disabled}
          block
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TokenIcon name={value.name} />
            <Typography.Title level={5} style={{ marginLeft: '8px' }}>
              {value.name}
            </Typography.Title>
          </span>
          {!readonly && <DownOutlined />}
        </Button>
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
  name: string;
}

const TokeSelectFormItem: React.FC<TokeSelectFormItem> = ({
  name,
  ...rest
}) => {
  return (
    <Form.Item name={name}>
      {(params) => <TokenSelect {...{ ...rest, ...params }} />}
    </Form.Item>
  );
};

export { TokenSelect, TokeSelectFormItem };
