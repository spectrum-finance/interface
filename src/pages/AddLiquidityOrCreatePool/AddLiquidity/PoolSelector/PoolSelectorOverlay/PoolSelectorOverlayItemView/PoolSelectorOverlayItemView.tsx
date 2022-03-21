import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { Box } from '../../../../../../ergodex-cdk';
import { PoolView } from '../../PoolView/PoolView';

interface PoolSelectorOverlayItemViewProps {
  readonly ammPool: AmmPool;
  readonly className?: string;
  readonly active?: boolean;
  readonly onChange?: (ammPool: AmmPool) => void;
}

const _PoolSelectorOverlayItemView: FC<PoolSelectorOverlayItemViewProps> = ({
  ammPool,
  className,
  active,
  onChange,
}) => {
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);

  const handleMouseEnter = () => setMouseEntered(true);

  const handleMouseLeave = () => setMouseEntered(false);

  const handleClick = () => onChange && onChange(ammPool);

  return (
    <Box
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      bordered={false}
      borderRadius="none"
      padding={[1, 3]}
      className={className}
    >
      <PoolView ammPool={ammPool} hover={mouseEntered} active={active} />
    </Box>
  );
};

export const PoolSelectorOverlayItemView = styled(_PoolSelectorOverlayItemView)`
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    background: var(--ergo-pool-position-bg-hover);
  }

  ${(props) => props.active && 'background: var(--ergo-pool-position-bg)'}
`;
