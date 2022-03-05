import './Pool.less';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ammPools$ } from '../../api/ammPools';
import { useAssetsBalance } from '../../api/assetBalance';
import { positions$ } from '../../api/positions';
import { isWalletSetuped$ } from '../../api/wallets';
import { useObservable } from '../../common/hooks/useObservable';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { Page } from '../../components/Page/Page';
import {
  DownOutlined,
  Dropdown,
  Flex,
  Input,
  Menu,
  SearchOutlined,
  Tabs,
} from '../../ergodex-cdk';
import { useQuery } from '../../hooks/useQuery';
import { EmptyPositionsWrapper } from './components/EmptyPositionsWrapper/EmptyPositionsWrapper';
import { LiquidityPositionsList } from './components/LiquidityPositionsList/LiquidityPositionsList';
import { LockListView } from './components/LocksList/LockListView';

interface PoolPageWrapperProps {
  children?: React.ReactChild | React.ReactChild[];
  isWalletConnected: boolean;
  onClick: () => void;
}

const PoolPageWrapper: React.FC<PoolPageWrapperProps> = ({
  children,
  isWalletConnected,
  onClick,
}) => {
  return (
    <Flex col>
      <Flex.Item marginBottom={isWalletConnected ? 2 : 0}>
        <Page
          width={832}
          title="Liquidity"
          titleChildren={
            isWalletConnected && (
              <>
                <Dropdown.Button
                  type="primary"
                  icon={<DownOutlined />}
                  size="middle"
                  overlay={
                    <Menu style={{ padding: '8px', width: '200px' }}>
                      <Menu.Item
                        disabled
                        key="1"
                        className="ergodex-coming-soon"
                      >
                        Create pool
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  onClick={onClick}
                >
                  + Add liquidity
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

const Pool = (): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, [], false);
  const [, isBalanceLoading] = useAssetsBalance();
  const history = useHistory();
  const query = useQuery();
  const [term, setTerm] = useState<string | undefined>();

  const defaultActiveTabKey = 'positions-overview';

  useEffect(() => {
    history.push(`/pool?active=${query.get('active') ?? defaultActiveTabKey}`);
  }, []);

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const [pools, isPoolsLoading] = useObservable(ammPools$, [], []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(e.target.value);

  const handleAddLiquidity = () => {
    history.push('/pool/add');
  };

  return (
    <PoolPageWrapper
      isWalletConnected={isWalletConnected}
      onClick={handleAddLiquidity}
    >
      <Tabs
        tabBarExtraContent={{
          right: (
            <Input
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              placeholder="Search"
              size="large"
              style={{ width: 300 }}
            />
          ),
        }}
        defaultActiveKey={query.get('active')!}
        type="card"
        className="pool__position-tabs"
        onChange={(key) => {
          history.push(`/pool?active=${key}`);
        }}
      >
        <Tabs.TabPane tab="Pools Overview" key={defaultActiveTabKey}>
          <LiquidityPositionsList
            totalCount={pools.length}
            pools={pools.filter((p) => p.match(term))}
            loading={isPoolsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Your Positions" key="your-positions">
          {isWalletConnected ? (
            <LiquidityPositionsList
              totalCount={positions.length}
              pools={positions.map((p) => p.pool).filter((p) => p.match(term))}
              loading={isBalanceLoading || isPositionLoading}
            />
          ) : (
            <EmptyPositionsWrapper>
              <ConnectWalletButton />
            </EmptyPositionsWrapper>
          )}
        </Tabs.TabPane>
        {isWalletConnected && positions.some((p) => p.locks.length) && (
          <Tabs.TabPane tab="Locked Positions" key="locked-positions">
            <LockListView
              positions={positions.filter(
                (p) => !!p.locks.length && p.match(term),
              )}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </PoolPageWrapper>
  );
};

export { Pool };
