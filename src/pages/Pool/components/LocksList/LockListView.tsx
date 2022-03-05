import React, { FC } from 'react';

import { Position } from '../../../../common/models/Position';
import { List } from '../../../../ergodex-cdk';
import { EmptyTemplateContainer } from '../../common/EmptyTemplateContainer/EmptyTemplateContainer';
import { LockItemView } from './LockItemView/LockItemView';

interface LockListViewProps {
  positions: Position[];
}

export const LockListView: FC<LockListViewProps> = ({ positions }) => {
  return (
    <List
      dataSource={positions}
      gap={2}
      emptyTemplate={
        <EmptyTemplateContainer>No results found</EmptyTemplateContainer>
      }
    >
      {(position) => <LockItemView position={position} />}
    </List>
  );
};
