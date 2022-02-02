import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as RelockIcon } from '../../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../../assets/icons/withdrawal-icon.svg';
import { Position } from '../../../../common/models/Position';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { OptionsButton } from '../../../../components/common/OptionsButton/OptionsButton';
import { ListItemWrapper } from '../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Box, Flex, List, Menu, Typography } from '../../../../ergodex-cdk';

interface LockItemViewProps {
  readonly position: Position;
}

const LockItemView: FC<LockItemViewProps> = ({ position }) => {
  return (
    <ListItemWrapper>
      <Flex>
        <Flex.Item style={{ width: '230px' }} marginRight={16}>
          <Flex col>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Total locked</Typography.Footnote>
            </Flex.Item>
            <Flex col justify="space-between">
              <Flex.Item marginBottom={1}>
                <Box padding={[0.5, 1]}>
                  <Flex justify="space-between">
                    <Flex.Item marginRight={1}>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <TokenIcon name={position.availableX.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {position.availableX.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {position.lockedX.toString({ suffix: false })}
                    </Typography.Title>
                  </Flex>
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Box padding={[0.5, 1]}>
                  <Flex justify="space-between">
                    <Flex.Item marginRight={1}>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <TokenIcon name={position.availableY.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {position.availableY.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {position.lockedY.toString({ suffix: false })}
                    </Typography.Title>
                  </Flex>
                </Box>
              </Flex.Item>
            </Flex>
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '230px' }} marginRight={16}>
          <Flex col>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Total withdrawable </Typography.Footnote>
            </Flex.Item>
            <Flex col justify="space-between">
              <Flex.Item marginBottom={1}>
                <Box padding={[0.5, 1]}>
                  <Flex justify="space-between">
                    <Flex.Item marginRight={1}>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <TokenIcon name={position.availableX.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {position.availableX.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {position.withdrawableLockedX.toString({
                        suffix: false,
                      })}
                    </Typography.Title>
                  </Flex>
                </Box>
              </Flex.Item>
              <Flex.Item>
                <Box padding={[0.5, 1]}>
                  <Flex justify="space-between">
                    <Flex.Item marginRight={1}>
                      <Flex>
                        <Flex.Item marginRight={1}>
                          <TokenIcon name={position.availableY.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {position.availableY.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {position.withdrawableLockedY.toString({
                        suffix: false,
                      })}
                    </Typography.Title>
                  </Flex>
                </Box>
              </Flex.Item>
            </Flex>
          </Flex>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Flex col justify="space-between" inline>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Share</Typography.Footnote>
            </Flex.Item>
            <DataTag size="large" content={`${position.totalLockedPercent}%`} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex stretch align="center">
            <OptionsButton size="large" type="text" width={180}>
              <Menu.Item icon={<RelockIcon />}>
                <Link to={`/pool/${position.pool.id}/relock`}>
                  Relock liquidity
                </Link>
              </Menu.Item>
              <Menu.Item icon={<WithdrawalIcon />}>
                <Link to={`/pool/${position.pool.id}/withdrawal`}>
                  Withdrawal
                </Link>
              </Menu.Item>
            </OptionsButton>
          </Flex>
        </Flex.Item>
      </Flex>
    </ListItemWrapper>
  );
};

interface LockListViewProps {
  positions: Position[];
}

export const LockListView: FC<LockListViewProps> = ({ positions }) => {
  return (
    <List dataSource={positions} gap={2}>
      {(position) => <LockItemView position={position} />}
    </List>
  );
};
