import React, { FC } from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { ExpandComponentProps } from '../../../../../../components/TableView/common/Expand';
import { PoolsOrPositionDetails } from '../../../common/PoolsOrPositionDetails/PoolsOrPositionDetails';

export const PoolDetails: FC<ExpandComponentProps<AmmPool>> = ({
  item,
  ...rest
}) => <PoolsOrPositionDetails poolMapper={() => item} item={item} {...rest} />;
