import { Box, List } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { PoolSelectorOverlayItemView } from './PoolSelectorOverlayItemView/PoolSelectorOverlayItemView';

export interface PoolSelectorOverlayProps {
  readonly ammPools: AmmPool[];
  readonly className?: string;
  readonly value?: AmmPool;
  readonly onChange?: (ammPool: AmmPool) => void;
}

const _PoolSelectorOverlay: FC<PoolSelectorOverlayProps> = ({
  ammPools,
  value,
  className,
  onChange,
}) => (
  <Box borderRadius="m" padding={[1, 0, 1, 0]} className={className}>
    <List dataSource={ammPools} maxHeight={250}>
      {(ammPool) => (
        <PoolSelectorOverlayItemView
          onChange={onChange}
          active={value?.id === ammPool.id}
          ammPool={ammPool}
        />
      )}
    </List>
  </Box>
);

export const PoolSelectorOverlay = styled(_PoolSelectorOverlay)`
  overflow: hidden;
  width: 100%;
`;
