import { Flex, Typography } from '@ergolabs/ui-kit';
import { head } from 'lodash';
import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';

const PoolCard: FC<{ pool: AmmPool }> = ({ pool }) => (
  <Flex>
    <Flex.Item flex={1} maxWidth={200}>
      <Typography.Body>{pool.x.asset.name}</Typography.Body>
    </Flex.Item>
    <Flex.Item flex={1} maxWidth={100}>
      <Typography.Body>{pool.y.asset.name}</Typography.Body>
    </Flex.Item>
    <Flex.Item flex={1}>
      <Typography.Body>{pool.tvl?.value}</Typography.Body>
    </Flex.Item>
  </Flex>
);

export const PoolsOverview: FC<{ pools: AmmPool[] }> = ({ pools }) => {
  return pools.length ? <PoolCard pool={head(pools)!} /> : null;
};

// 1. List states +
// 2. Try to fix overlay property +

// 3. Test Detail Animation
// 4. Expand event trigger analyze (on tableView)
// 5. Mobile case for table.

// <List
//   itemKey="id"
//   items={pools}
//   gap={2}
//   itemHeight={80}
//   maxHeight={200}
//   expand={{ accordion: true, height: 96 }}
// >
//   {({ item, height, expand }) => (
//     <Box control height={height} onClick={() => expand()}>
//       <Typography.Body>{item.id}</Typography.Body>
//     </Box>
//   )}
//   <ListStateView name="loading" condition={!pools.length}>
//     <LoadingDataState height={150} />
//   </ListStateView>
// </List>
