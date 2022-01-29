import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { locksAccumulators$ } from '../../../../api/locks';
import { ReactComponent as RelockIcon } from '../../../../assets/icons/relock-icon.svg';
import { ReactComponent as WithdrawalIcon } from '../../../../assets/icons/withdrawal-icon.svg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AssetLockAccumulator } from '../../../../common/models/AssetLockAccumulator';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { OptionsButton } from '../../../../components/common/OptionsButton/OptionsButton';
import { ListItemWrapper } from '../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Box, Flex, List, Menu, Typography } from '../../../../ergodex-cdk';
import { PositionListLoader } from '../PositionListLoader/PositionListLoader';

interface LockItemViewProps {
  readonly lockAccumulator: AssetLockAccumulator;
}

const LockItemView: FC<LockItemViewProps> = ({ lockAccumulator }) => {
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
                          <TokenIcon name={lockAccumulator.x.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {lockAccumulator.x.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {lockAccumulator.x.toString({ suffix: false })}
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
                          <TokenIcon name={lockAccumulator.y.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {lockAccumulator.y.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {lockAccumulator.y.toString({ suffix: false })}
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
                          <TokenIcon name={lockAccumulator.x.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {lockAccumulator.x.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {lockAccumulator.withdrawableX.toString({
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
                          <TokenIcon name={lockAccumulator.y.asset.name} />
                        </Flex.Item>
                        <Typography.Title level={5}>
                          {lockAccumulator.y.asset.name}
                        </Typography.Title>
                      </Flex>
                    </Flex.Item>
                    <Typography.Title level={5}>
                      {lockAccumulator.withdrawableY.toString({
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
            <DataTag size="large" content={`${lockAccumulator.share}%`} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex stretch align="center">
            <OptionsButton size="large" type="text" width={180}>
              <Menu.Item icon={<RelockIcon />}>
                <Link to={`/pool/${lockAccumulator.pool.id}/relock`}>
                  Relock liquidity
                </Link>
              </Menu.Item>
              <Menu.Item icon={<WithdrawalIcon />}>
                <Link to={`/pool/${lockAccumulator.pool.id}/withdrawal`}>
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

export const LockListView: FC = () => {
  const [locksAccumulators, loading] = useObservable(locksAccumulators$);

  if (loading) {
    return <PositionListLoader />;
  }

  return (
    <List dataSource={locksAccumulators} gap={2}>
      {(lockAccumulator) => <LockItemView lockAccumulator={lockAccumulator} />}
    </List>
  );
};
