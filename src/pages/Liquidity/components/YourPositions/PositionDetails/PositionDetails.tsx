import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';
import { PoolsOrPositionDetails } from '../../../common/PoolsOrPositionDetails/PoolsOrPositionDetails';

export const PositionDetails: FC<ExpandComponentProps<Position>> = ({
  item,
  ...rest
}) => (
  <PoolsOrPositionDetails poolMapper={() => item.pool} item={item} {...rest}>
    <Flex col>
      <Typography.Footnote>
        <Trans>Total liquidity</Trans>
      </Typography.Footnote>
      <Typography.Body strong>
        {item.totalX.asset.name}: {item.totalX.toString()}
      </Typography.Body>
      <Typography.Body strong>
        {item.totalY.asset.name}: {item.totalY.toString()}
      </Typography.Body>
    </Flex>
  </PoolsOrPositionDetails>
);
