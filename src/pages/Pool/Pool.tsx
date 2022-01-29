import './Pool.less';

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ammPools$ } from '../../api/ammPools';
import { useObservable } from '../../common/hooks/useObservable';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { DownOutlined, Dropdown, Flex, Menu, Tabs } from '../../ergodex-cdk';
import { useQuery } from '../../hooks/useQuery';
import { isWalletLoading$, isWalletSetuped$ } from '../../services/new/core';
import { availablePools$ } from '../../services/new/pools';
import { EmptyPositionsWrapper } from './components/EmptyPositionsWrapper/EmptyPositionsWrapper';
import { LiquidityPositionsList } from './components/LiquidityPositionsList/LiquidityPositionsList';
import { LockListView } from './components/LocksList/LockListView';

// import { LPGuide } from './LPGuide/LPGuide';

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
        <FormPageWrapper
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
        </FormPageWrapper>
      </Flex.Item>
    </Flex>
  );
};

const Pool = (): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, [], false);
  const [isWalletLoading] = useObservable(isWalletLoading$);
  const history = useHistory();
  const query = useQuery();

  const defaultActiveTabKey = 'positions-overview';

  useEffect(() => {
    history.push(`/pool?active=${query.get('active') ?? defaultActiveTabKey}`);
  }, []);

  const [availablePools, isAvailablePoolsLoading] = useObservable(
    availablePools$,
    [],
    [],
  );

  const [pools, isPoolsLoading] = useObservable(ammPools$, [], []);

  const handleAddLiquidity = () => {
    history.push('/pool/add');
  };

  return (
    <PoolPageWrapper
      isWalletConnected={isWalletConnected}
      onClick={handleAddLiquidity}
    >
      <Tabs
        defaultActiveKey={query.get('active')!}
        type="card"
        className="pool__position-tabs"
        onChange={(key) => {
          history.push(`/pool?active=${key}`);
        }}
      >
        <Tabs.TabPane tab="Pools Overview" key={defaultActiveTabKey}>
          <LiquidityPositionsList pools={pools} loading={isPoolsLoading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Your Positions" key="your-positions">
          {isWalletConnected ? (
            <LiquidityPositionsList
              pools={availablePools}
              loading={isWalletLoading || isAvailablePoolsLoading}
            />
          ) : (
            <EmptyPositionsWrapper>
              <ConnectWalletButton />
            </EmptyPositionsWrapper>
          )}
        </Tabs.TabPane>
        {/*TODO: Add isWalletConnected and hasUserLockedPositions checks for this tab*/}
        <Tabs.TabPane tab="Locked Positions" key="locked-positions">
          <LockListView />
        </Tabs.TabPane>
      </Tabs>
    </PoolPageWrapper>
  );
};

export { Pool };
