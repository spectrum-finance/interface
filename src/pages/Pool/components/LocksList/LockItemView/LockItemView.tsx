import React, { FC, ReactNode } from 'react';

import { Position } from '../../../../../common/models/Position';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenTitle } from '../../../../../components/TokenTitle';
import { Flex, Typography } from '../../../../../ergodex-cdk';

interface LockItemViewColumnProps {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly width?: number;
  readonly marginRight?: number;
}

const LockItemViewColumn: FC<LockItemViewColumnProps> = ({
  title,
  children,
  width,
  marginRight,
}) => (
  <Flex.Item marginRight={marginRight}>
    <Flex col stretch style={{ width }}>
      <Flex.Item marginBottom={1}>
        <Typography.Footnote>{title}</Typography.Footnote>
        {children}
      </Flex.Item>
    </Flex>
  </Flex.Item>
);

export interface LockItemViewProps {
  readonly position: Position;
}

export const LockItemView: FC<LockItemViewProps> = ({ position }) => (
  <ListItemWrapper>
    <Flex align="center">
      <LockItemViewColumn title="Pair" width={164} marginRight={4}>
        <Flex col stretch>
          <Flex.Item marginBottom={3}>
            <TokenTitle value={position.availableX.asset} />
          </Flex.Item>
          <TokenTitle value={position.availableY.asset} />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn title="Total locked" width={215} marginRight={4}>
        <Flex col stretch>
          <Flex.Item marginBottom={1}>
            <DataTag
              content={position.lockedX.toAmount()}
              justify="flex-end"
              width={120}
            />
          </Flex.Item>
          <DataTag
            content={position.lockedY.toAmount()}
            justify="flex-end"
            width={120}
          />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn
        title="Total withdrawable"
        width={215}
        marginRight={4}
      >
        <Flex col stretch>
          <Flex.Item marginBottom={1}>
            <DataTag
              content={position.withdrawableLockedX.toAmount()}
              justify="flex-end"
              width={120}
            />
          </Flex.Item>
          <DataTag
            content={position.withdrawableLockedY.toAmount()}
            justify="flex-end"
            width={120}
          />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn title="Share" width={100}>
        <Flex col style={{ height: 60 }} justify="center">
          <DataTag size="large" content={`${position.totalLockedPercent}%`} />
        </Flex>
      </LockItemViewColumn>
    </Flex>
  </ListItemWrapper>
);
