import './Pool.less';

import { t, Trans } from '@lingui/macro';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ammPools$ } from '../../api/ammPools';
import { useAssetsBalance } from '../../api/assetBalance';
import { positions$ } from '../../api/positions';
import { isWalletSetuped$ } from '../../api/wallets';
import { useObservable } from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { Page } from '../../components/Page/Page';
import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Input,
  Menu,
  SearchOutlined,
  Tabs,
} from '../../ergodex-cdk';
import { useQuery } from '../../hooks/useQuery';
import { EmptyPositionsList } from './common/EmptyPositionsList/EmptyPositionsList';
import { LiquidityPositionsList } from './components/LiquidityPositionsList/LiquidityPositionsList';
import { LockListView } from './components/LocksList/LockListView';

interface PoolPageWrapperProps {
  children?: React.ReactNode | React.ReactNode[];
  isWalletConnected: boolean;
  onClick: () => void;
  isCurrentTabDefault: boolean;
}

const PoolPageWrapper: React.FC<PoolPageWrapperProps> = ({
  children,
  isWalletConnected,
  onClick,
  isCurrentTabDefault,
}) => {
  return (
    <Flex col>
      <Flex.Item marginBottom={isWalletConnected ? 2 : 0}>
        <Page
          width={832}
          title={<Trans>Liquidity</Trans>}
          padding={isCurrentTabDefault ? [6, 6, 2, 6] : [6, 6]}
          titleChildren={
            isWalletConnected && (
              <>
                <Dropdown.Button
                  type="primary"
                  icon={<DownOutlined />}
                  size="middle"
                  overlay={
                    <Menu style={{ padding: '8px', width: '200px' }}>
                      <Menu.Item key="1">
                        <Link to="pool/create">
                          <Trans>Create pool</Trans>
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  onClick={onClick}
                >
                  <Trans>Add liquidity</Trans>
                </Dropdown.Button>
              </>
            )
          }
        >
          {children}
        </Page>
      </Flex.Item>
    </Flex>
  );
};

const Liquidity = (): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, [], false);
  const [, isBalanceLoading] = useAssetsBalance();
  const history = useHistory();
  const query = useQuery();
  const [term, setTerm] = useState<string | undefined>();
  const [isCommunityPoolsShown, setIsCommunityPoolsShown] =
    useState<boolean>(false);

  const defaultActiveTabKey = 'positions-overview';

  useEffect(() => {
    history.push(`/pool?active=${query.active ?? defaultActiveTabKey}`);
  }, []);

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const [pools, isPoolsLoading] = useObservable(ammPools$, [], []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(e.target.value);

  const handleAddLiquidity = () => {
    history.push('/pool/add');
  };

  const filterCommunityPools = useCallback(
    (pools: AmmPool[]): AmmPool[] => {
      return isCommunityPoolsShown
        ? pools
        : pools.filter((pool) => pool.verified);
    },
    [isCommunityPoolsShown],
  );

  const handleShowCommunityPools = () => {
    setIsCommunityPoolsShown((prev) => !prev);
  };

  const isCurrentTabDefault = query.active === defaultActiveTabKey;

  return (
    <PoolPageWrapper
      isWalletConnected={isWalletConnected}
      onClick={handleAddLiquidity}
      isCurrentTabDefault={isCurrentTabDefault}
    >
      <Tabs
        tabBarExtraContent={{
          right: (
            <Input
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              placeholder={t`Type token name or pool id`}
              size="large"
              style={{ width: 300 }}
            />
          ),
        }}
        defaultActiveKey={String(query.active)}
        className="pool__position-tabs"
        onChange={(key) => {
          history.push(`/pool?active=${key}`);
        }}
      >
        <Tabs.TabPane
          tab={<Trans>Pools Overview</Trans>}
          key={defaultActiveTabKey}
        >
          <LiquidityPositionsList
            totalCount={pools.length}
            pools={filterCommunityPools(pools.filter((p) => p.match(term)))}
            loading={isPoolsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Trans>Your Positions</Trans>} key="your-positions">
          {isWalletConnected ? (
            <LiquidityPositionsList
              totalCount={positions.length}
              pools={positions.map((p) => p.pool).filter((p) => p.match(term))}
              loading={isBalanceLoading || isPositionLoading}
            />
          ) : (
            <EmptyPositionsList>
              <ConnectWalletButton />
            </EmptyPositionsList>
          )}
        </Tabs.TabPane>
        {isWalletConnected && positions.some((p) => p.locks.length) && (
          <Tabs.TabPane
            tab={<Trans>Locked Positions</Trans>}
            key="locked-positions"
          >
            <LockListView
              positions={positions.filter(
                (p) => !!p.locks.length && p.match(term),
              )}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
      {isCurrentTabDefault && (
        <Flex justify="center" align="center">
          <Button size="large" type="link" onClick={handleShowCommunityPools}>
            {t`${isCommunityPoolsShown ? 'Hide' : 'Show'} Community Pools`}
          </Button>
        </Flex>
      )}
    </PoolPageWrapper>
  );
};

export { Liquidity };
