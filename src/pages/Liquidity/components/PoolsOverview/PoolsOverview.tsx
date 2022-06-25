import { Box, LoadingDataState, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { List } from '../../List/List';
import { ListStateView } from '../../List/ListStateView/ListStateView';

export const PoolsOverview: FC<{ pools: AmmPool[] }> = ({ pools }) => {
  console.log(!pools.length);
  return (
    <>
      <List
        itemKey="id"
        items={pools}
        gap={2}
        itemHeight={80}
        maxHeight={200}
        expand={{ accordion: true, height: 96 }}
      >
        {({ item, height, expand }) => (
          <Box control height={height} onClick={() => expand()}>
            <Typography.Body>{item.id}</Typography.Body>
          </Box>
        )}
        <ListStateView name="loading" condition={!pools.length}>
          <LoadingDataState height={150} />
        </ListStateView>
      </List>
    </>
  );
};

// 1. List states
// 2. Try to fix overlay property
// 3. Test Detail Animation
// 4. Expand event trigger analyze (on tableView)
// 5. Mobile case for table.
