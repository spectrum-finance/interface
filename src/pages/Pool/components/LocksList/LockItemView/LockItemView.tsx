import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as RelockIcon } from '../../../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../../../assets/icons/withdrawal-icon.svg';
import { Position } from '../../../../../common/models/Position';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { OptionsButton } from '../../../../../components/common/OptionsButton/OptionsButton';
import { ListItemWrapper } from '../../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenTitle } from '../../../../../components/TokenTitle';
import { Flex, Menu, Typography } from '../../../../../ergodex-cdk';

interface LockItemViewColumnProps {
  readonly title?: ReactNode | ReactNode[] | string;
  readonly children?: ReactNode | ReactNode[] | string;
  readonly width?: number;
  readonly marginRight?: number;
  readonly flex?: number;
}

const LockItemViewColumn: FC<LockItemViewColumnProps> = ({
  title,
  children,
  width,
  marginRight,
  flex,
}) => (
  <Flex.Item marginRight={marginRight} flex={flex}>
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
      <LockItemViewColumn title={t`Pair`} width={164} marginRight={4}>
        <Flex col stretch>
          <Flex.Item marginBottom={3}>
            <TokenTitle value={position.availableX.asset} />
          </Flex.Item>
          <TokenTitle value={position.availableY.asset} />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn title={t`Total locked`} width={180} marginRight={4}>
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
        title={t`Total withdrawable`}
        width={180}
        marginRight={4}
      >
        <Flex col stretch>
          <Flex.Item marginBottom={1}>
            <DataTag
              content={position.withdrawableLockedX.toString()}
              justify="flex-end"
              width={120}
            />
          </Flex.Item>
          <DataTag
            content={position.withdrawableLockedY.toString()}
            justify="flex-end"
            width={120}
          />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn title={t`Share`} width={100}>
        <Flex col style={{ height: 60 }} justify="center">
          <DataTag size="large" content={`${position.totalLockedPercent}%`} />
        </Flex>
      </LockItemViewColumn>
      <LockItemViewColumn flex={1}>
        <Flex stretch align="center" justify="flex-end">
          <OptionsButton size="large" type="text" width={160}>
            <Menu.Item icon={<RelockIcon />}>
              <Link to={`/pool/${position.pool.id}/relock`}>
                <Trans>Relock liquidity</Trans>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<WithdrawalIcon />}>
              <Link to={`/pool/${position.pool.id}/withdrawal`}>
                <Trans>Withdrawal</Trans>
              </Link>
            </Menu.Item>
          </OptionsButton>
        </Flex>
      </LockItemViewColumn>
    </Flex>
  </ListItemWrapper>
);
