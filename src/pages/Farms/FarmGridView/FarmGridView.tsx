import * as React from 'react';
import styled from 'styled-components';

import { device } from '../../../common/constants/size';
import { AmmPool } from '../../../common/models/AmmPool';
import { Position } from '../../../common/models/Position';
import { FarmCardView } from './FarmCardView/FarmCardView';

export interface FarmGridViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly loading?: boolean;
  readonly className?: string;
}

const _FarmGridView: React.FC<FarmGridViewProps<AmmPool>> = ({
  items,
  className,
}) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <FarmCardView item={item} key={item.id} />
      ))}
    </div>
  );
};

export const FarmGridView = styled(_FarmGridView)`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  ${device.m} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${device.l} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
