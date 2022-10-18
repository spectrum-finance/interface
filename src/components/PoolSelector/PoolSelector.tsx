import {
  Button,
  Control,
  DownOutlined,
  Dropdown,
  Flex,
  UpOutlined,
  useDevice,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../common/models/AmmPool';
import { PoolSelectorOverlay } from './PoolSelectorOverlay/PoolSelectorOverlay';
import { PoolView } from './PoolView/PoolView';

export interface PoolSelectorProps extends Control<AmmPool | undefined> {
  readonly ammPools?: AmmPool[];
  readonly className?: string;
  readonly afterSelectOverlayOpen?: () => void;
  readonly afterAmmPoolSelected?: (ammPool: AmmPool) => void;
  readonly hasSearch?: boolean;
  readonly ammPoolsLoading?: boolean;
}

const StyledButton = styled(Button)`
  padding: calc(var(--spectrum-base-gutter) * 1)
    calc(var(--spectrum-base-gutter) * 3);
`;

export const PoolSelector: FC<PoolSelectorProps> = ({
  value,
  onChange,
  className,
  ammPools,
  afterAmmPoolSelected,
  afterSelectOverlayOpen,
  hasSearch,
  ammPoolsLoading,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const { s } = useDevice();

  const handleChange = (ammPool: AmmPool) => {
    if (onChange) {
      onChange(ammPool);
      setOpened(false);
      afterAmmPoolSelected && afterAmmPoolSelected(ammPool);
    }
  };

  return (
    <>
      <Dropdown
        overlayClassName={className}
        overlay={
          <PoolSelectorOverlay
            hasSearch={hasSearch}
            onChange={handleChange}
            ammPoolsLoading={ammPoolsLoading}
            value={value}
            ammPools={ammPools || []}
          />
        }
        onVisibleChange={(visible) => {
          if (visible && value && afterSelectOverlayOpen) {
            afterSelectOverlayOpen();
          }
          return setOpened(visible);
        }}
        visible={opened}
        trigger={['click']}
      >
        <StyledButton size="large" block>
          <Flex align="center">
            {value ? <PoolView hideInfo={s} ammPool={value} /> : t`Select Pool`}
            <Flex.Item justify="flex-end" flex={1}>
              {opened ? <UpOutlined /> : <DownOutlined />}
            </Flex.Item>
          </Flex>
        </StyledButton>
      </Dropdown>
    </>
  );
};
