import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../../components/TableView/common/Expand';
import { PoolOrPositionDetails } from '../../../common/PoolOrPositionDetails/PoolOrPositionDetails';

export const PositionDetails: FC<ExpandComponentProps<Position>> = ({
  item,
  ...rest
}) => (
  <PoolOrPositionDetails poolMapper={() => item.pool} item={item} {...rest}>
    <Flex col>
      <Typography.Footnote>
        <Trans>Your liquidity</Trans>
      </Typography.Footnote>
      <Typography.Body strong>
        {item.totalX.asset.ticker}: {item.totalX.toString()}
      </Typography.Body>
      <Typography.Body strong>
        {item.totalY.asset.ticker}: {item.totalY.toString()}
      </Typography.Body>
    </Flex>
  </PoolOrPositionDetails>
);
