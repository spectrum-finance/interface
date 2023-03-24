import {
  Button,
  DownOutlined,
  Flex,
  Form,
  Modal,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { AnalyticsTrace, fireAnalyticsEvent } from '@spectrumlabs/analytics';
import React from 'react';
import { Observable } from 'rxjs';
import styled from 'styled-components';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { mapToTokenProps } from '../../../../utils/analytics/mapper';
import { AssetTitle } from '../../../AssetTitle/AssetTitle';
import { AssetListModal } from './AssetListModal/AssetListModal';

interface TokenSelectProps {
  readonly value?: AssetInfo | undefined;
  readonly onChange?: (value: AssetInfo) => void;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
  readonly loading?: boolean;
  readonly trace: AnalyticsTrace;
}

const StyledDownOutlined = styled(DownOutlined)`
  font-size: 1rem;
`;

const StyledButton = styled(Button)`
  padding: ${({ size }) =>
    size === 'large'
      ? '0 calc(var(--spectrum-base-gutter) * 3)'
      : '0 calc(var(--spectrum-base-gutter) * 2)'};
  width: 100%;
`;

const AssetSelect: React.FC<TokenSelectProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  assets$,
  assetsToImport$,
  importedAssets$,
  loading,
  trace,
}) => {
  const { valBySize } = useDevice();
  const handleSelectChange = (newValue: AssetInfo): void => {
    if (value?.id !== newValue?.id && onChange) {
      onChange(newValue);
    }
    fireAnalyticsEvent('Select Token', {
      ...mapToTokenProps(newValue),
      element_location: trace.elementLocation,
    });
  };

  const openTokenModal = () => {
    if (readonly) {
      return;
    }
    Modal.open(({ close }) => (
      <AssetListModal
        assetsToImport$={assetsToImport$}
        assets$={assets$}
        importedAssets$={importedAssets$}
        close={close}
        value={value}
        onSelectChanged={handleSelectChange}
      />
    ));
  };

  return (
    <>
      {loading ? (
        <Button
          type="default"
          loading
          size={valBySize('middle', 'large')}
          style={{
            padding:
              valBySize('middle', 'large') === 'large'
                ? '0 calc(var(--spectrum-base-gutter) * 3)'
                : '0 calc(var(--spectrum-base-gutter) * 2)',
          }}
        >
          Loading...
        </Button>
      ) : (
        <StyledButton
          type={value ? 'ghost' : 'primary'}
          size={valBySize('middle', 'large')}
          onClick={openTokenModal}
          disabled={disabled}
        >
          <Flex align="center">
            <Flex.Item flex={1} align="flex-start" display="flex">
              {value ? (
                <AssetTitle gap={2} asset={value} />
              ) : (
                <Trans>Select a token</Trans>
              )}
            </Flex.Item>
            <Flex.Item marginLeft={2}>
              <StyledDownOutlined />
            </Flex.Item>
          </Flex>
        </StyledButton>
      )}
    </>
  );
};

interface TokeSelectFormItem extends TokenSelectProps {
  name: string;
}

const AssetSelectFormItem: React.FC<TokeSelectFormItem> = ({
  name,
  ...rest
}) => {
  return (
    <Form.Item name={name}>
      {(params) => <AssetSelect {...{ ...rest, ...params }} />}
    </Form.Item>
  );
};

export { AssetSelect, AssetSelectFormItem };
