import React, { FC } from 'react';

import { Position } from '../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';
import { PoolsOrPositionDetails } from '../../../common/PoolsOrPositionDetails/PoolsOrPositionDetails';

export const PositionDetails: FC<ExpandComponentProps<Position>> = ({
  item,
  ...rest
}) => (
  <PoolsOrPositionDetails poolMapper={() => item.pool} item={item} {...rest} />
);
