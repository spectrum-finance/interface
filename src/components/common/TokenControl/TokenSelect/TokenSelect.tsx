import './TokenSelect.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Button,
  DownOutlined,
  Form,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Observable } from 'rxjs';

import { AssetIcon } from '../../../AssetIcon/AssetIcon';
import { Truncate } from '../../../Truncate/Truncate';
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
            <AssetIcon asset={value} />
            <Typography.Title level={5} style={{ marginLeft: '8px' }}>
              <Truncate>{value.name}</Truncate>
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
          <Trans>Select a token</Trans>
          {!readonly && (
            <DownOutlined
              style={{
                display: 'inherit',
                marginLeft: '8px',
                width: '12px',
                height: '14px',
              }}
            />
          )}
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
