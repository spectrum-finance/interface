import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as RelockIcon } from '../../../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../../../assets/icons/withdrawal-icon.svg';
import { Position } from '../../../../../common/models/Position';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { OptionsButton } from '../../../../../components/common/OptionsButton/OptionsButton';
import { TableListItemView } from '../../../../../components/TableList/TableListItemView/TableListItemView';
import { TokenTitle } from '../../../../../components/TokenTitle';
import { Flex, Menu } from '../../../../../ergodex-cdk';

export interface LockItemViewProps {
  readonly position: Position;
}

export const LockItemView: FC<LockItemViewProps> = ({ position }) => (
  <TableListItemView hoverable={true} height={124} padding={4}>
    <TableListItemView.Column title={t`Pair`} width={164} marginRight={4}>
      <Flex col stretch>
        <Flex.Item marginBottom={3}>
          <TokenTitle asset={position.availableX.asset} />
        </Flex.Item>
        <TokenTitle asset={position.availableY.asset} />
      </Flex>
    </TableListItemView.Column>
    <TableListItemView.Column
      title={t`Total locked`}
      width={180}
      marginRight={4}
    >
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
    </TableListItemView.Column>
    <TableListItemView.Column
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
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Share`} width={100}>
      <DataTag size="large" content={`${position.totalLockedPercent}%`} />
    </TableListItemView.Column>
    <TableListItemView.Column flex={1}>
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
    </TableListItemView.Column>
  </TableListItemView>
);
