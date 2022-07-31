import React, { FC } from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { ExpandComponentProps } from '../../../../../../components/TableView/common/Expand';
import { PoolOrPositionDetails } from '../../../common/PoolOrPositionDetails/PoolOrPositionDetails';

export const PoolDetails: FC<ExpandComponentProps<AmmPool>> = ({
  item,
  ...rest
}) => <PoolOrPositionDetails poolMapper={() => item} item={item} {...rest} />;
