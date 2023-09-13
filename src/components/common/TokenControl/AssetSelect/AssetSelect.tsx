import {
  Button,
  DownOutlined,
  Flex,
  Form,
  Modal,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { fireAnalyticsEvent, TraceProps } from '@spectrumlabs/analytics';
import * as React from 'react';
import { Observable } from 'rxjs';
import styled from 'styled-components';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { mapToTokenProps } from '../../../../utils/analytics/mapper';
import { AssetTitle } from '../../../AssetTitle/AssetTitle';
import { SkeletonLoader } from '../../../SkeletonLoader/SkeletonLoader.tsx';
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
  readonly trace: TraceProps;
}

const StyledDownOutlined = styled(DownOutlined)`
  font-size: 1rem;
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
  trace: { element_name, element_location },
}) => {
  const { valBySize } = useDevice();
  const handleSelectChange = (newValue: AssetInfo): void => {
    if (value?.id !== newValue?.id && onChange) {
      onChange(newValue);
    }
    fireAnalyticsEvent('Select Token', {
      ...mapToTokenProps(newValue),
      element_location,
      element_name,
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
        <SkeletonLoader height={40} width={100} />
      ) : (
        <Button
          type={value ? 'ghost' : 'primary'}
          size={valBySize('large', 'extra-large')}
          onClick={openTokenModal}
          disabled={disabled}
        >
          <Flex align="center">
            <Flex.Item flex={1} align="flex-start" display="flex">
              {value ? (
                <AssetTitle level={4} gap={2} asset={value} />
              ) : (
                <Trans>Select a token</Trans>
              )}
            </Flex.Item>
            {!readonly && (
              <Flex.Item marginLeft={2}>
                <StyledDownOutlined />
              </Flex.Item>
            )}
          </Flex>
        </Button>
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
