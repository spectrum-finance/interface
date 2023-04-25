import { Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Position } from '../../../../../../common/models/Position';
import { ExpandComponentProps } from '../../../../../../components/TableView/common/Expand';
import { DetailsBox } from '../../../common/DetailsBox/DetailsBox';
import { PoolOrPositionDetails } from '../../../common/PoolOrPositionDetails/PoolOrPositionDetails';

export const PositionDetails: FC<ExpandComponentProps<Position>> = ({
  item,
  ...rest
}) => (
  <PoolOrPositionDetails poolMapper={() => item.pool} item={item} {...rest}>
    <DetailsBox
      title={<Trans>Your liquidity</Trans>}
      value={
        <Flex col>
          <Flex.Item marginBottom={1} display="flex" justify="flex-end">
            {item.totalX.asset.ticker}: {item.totalX.toString()}
          </Flex.Item>
          <Flex.Item display="flex" justify="flex-end">
            {item.totalY.asset.ticker}: {item.totalY.toString()}
          </Flex.Item>
        </Flex>
      }
    />
  </PoolOrPositionDetails>
);
