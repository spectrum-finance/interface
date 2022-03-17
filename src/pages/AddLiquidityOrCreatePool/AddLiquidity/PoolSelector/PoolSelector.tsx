import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../../common/models/AmmPool';
import {
  Button,
  Control,
  DownOutlined,
  Dropdown,
  Flex,
  UpOutlined,
} from '../../../../ergodex-cdk';
import { PoolSelectorOverlay } from './PoolSelectorOverlay/PoolSelectorOverlay';
import { PoolView } from './PoolView/PoolView';

export interface PoolSelectorProps extends Control<AmmPool | undefined> {
  readonly ammPools?: AmmPool[];
  readonly className?: string;
}

const _PoolSelector: FC<PoolSelectorProps> = ({
  value,
  onChange,
  className,
  ammPools,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const handleChange = (ammPool: AmmPool) => {
    if (onChange) {
      onChange(ammPool);
      setOpened(false);
    }
  };

  return (
    <>
      {ammPools?.length ? (
        <Dropdown
          overlayClassName={className}
          overlay={
            <PoolSelectorOverlay
              onChange={handleChange}
              value={value}
              ammPools={ammPools}
            />
          }
          onVisibleChange={(visible) => setOpened(visible)}
          visible={opened}
          trigger={['click']}
        >
          <Button size="large" block>
            <Flex align="center">
              {value && <PoolView ammPool={value} />}
              <Flex.Item justify="flex-end" flex={1}>
                {opened ? <UpOutlined /> : <DownOutlined />}
              </Flex.Item>
            </Flex>
          </Button>
        </Dropdown>
      ) : (
        <Button size="large" block disabled>
          Select pair
        </Button>
      )}
    </>
  );
};

export const PoolSelector = styled(_PoolSelector)`
  width: 418px;
`;
