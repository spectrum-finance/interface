import './Pool.less';

import { Input, SearchOutlined, Tabs, useSearch } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useObservable } from '../../common/hooks/useObservable';
import { useSearchParams } from '../../common/hooks/useSearchParams';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Position } from '../../common/models/Position';
import { Page } from '../../components/Page/Page';
import { ammPools$ } from '../../gateway/api/ammPools';
import { positions$ } from '../../gateway/api/positions';
import { useSelectedNetwork } from '../../gateway/common/network';
import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';
import { YourPositions } from './components/YourPositions/YourPositions';

interface PoolPageWrapperProps {
  children?: React.ReactNode | React.ReactNode[];
  isWalletConnected: boolean;
  onClick: () => void;
  isCurrentTabDefault: boolean;
  isCardano: boolean;
}

// const PoolPageWrapper: React.FC<PoolPageWrapperProps> = ({
//                                                            children,
//                                                            isWalletConnected,
//                                                            onClick,
//                                                            isCurrentTabDefault,
//                                                            isCardano,
//                                                          }) => {
//   return (
//     <Flex col>
//       <Flex.Item marginBottom={isWalletConnected ? 2 : 0}>
//         <Page
//           width={832}
//           title={<Trans>Liquidity</Trans>}
//           padding={isCurrentTabDefault && !isCardano ? [6, 6, 2, 6] : [6, 6]}
//           titleChildren={
//             isWalletConnected && (
//               <>
//                 <Dropdown.Button
//                   type="primary"
//                   icon={<DownOutlined />}
//                   size="middle"
//                   overlay={
//                     <Menu style={{ padding: '8px', width: '200px' }}>
//                       <Menu.Item key="1">
//                         <Link to="create">
//                           <Trans>Create pool</Trans>
//                         </Link>
//                       </Menu.Item>
//                     </Menu>
//                   }
//                   trigger={['click']}
//                   onClick={onClick}
//                 >
//                   <Trans>Add liquidity</Trans>
//                 </Dropdown.Button>
//               </>
//             )
//           }
//         >
//           {children}
//         </Page>
//       </Flex.Item>
//     </Flex>
//   );
// };

enum LiquidityTab {
  POOLS_OVERVIEW = 'positions-overview',
  YOUR_POSITIONS = 'your-positions',
  LOCKED_POSITIONS = 'locked-positions',
}

const matchItem = (
  item: AmmPool | Position | AssetLock,
  term?: string,
): boolean => {
  if (item instanceof AmmPool) {
    return item.match(term);
  }
  if (item instanceof Position) {
    return item.match(term);
  }
  return item.position.match(term);
};

const LiquidityTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
    margin-right: calc(var(--ergo-base-gutter) * 2);
  }

  .ant-tabs-nav {
    margin-bottom: calc(var(--ergo-base-gutter) * 2) !important;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

export const Liquidity = (): JSX.Element => {
  const [selectedNetwork] = useSelectedNetwork();

  const navigate = useNavigate();

  const [{ active }, setSearchParams] =
    useSearchParams<{ active: string | undefined }>();
  const [searchByTerm, setSearch] = useSearch<AmmPool | Position | AssetLock>(
    matchItem,
  );

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const [pools, isPoolsLoading] = useObservable(ammPools$, [], []);

  useEffect(() => {
    setIsCommunityPoolsShown(selectedNetwork.name === 'cardano');
  }, [selectedNetwork]);

  // useEffect(() => {
  //   navigate(`?active=${query.active ?? defaultActiveTabKey}`);
  // }, []);

  const [isCommunityPoolsShown, setIsCommunityPoolsShown] =
    useState<boolean>(false);

  const defaultActiveKey = active || LiquidityTab.POOLS_OVERVIEW;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleAddLiquidity = () => {
    navigate('add');
  };

  // const filterCommunityPools = useCallback(
  //   (pools: AmmPool[]): AmmPool[] => {
  //     return isCommunityPoolsShown
  //       ? pools
  //       : pools.filter((pool) => pool.verified);
  //   },
  //   [isCommunityPoolsShown],
  // );

  // const handleShowCommunityPools = () => {
  //   setIsCommunityPoolsShown((prev) => !prev);
  // };
  // const isCurrentTabDefault = query.active === defaultActiveTabKey;

  return (
    <Page width={832} title={<Trans>Liquidity</Trans>}>
      <LiquidityTabs
        tabBarExtraContent={{
          right: (
            <Input
              autoFocus
              onChange={handleSearchChange}
              prefix={<SearchOutlined />}
              placeholder={t`Type token name or pool id`}
              size="large"
            />
          ),
        }}
        defaultActiveKey={defaultActiveKey}
        onChange={(active) => setSearchParams({ active })}
      >
        <Tabs.TabPane
          tab={<Trans>Pools Overview</Trans>}
          key={LiquidityTab.POOLS_OVERVIEW}
        >
          <PoolsOverview
            ammPools={(searchByTerm(pools) as AmmPool[]) || []}
            loading={isPoolsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<Trans>Your Positions</Trans>}
          key={LiquidityTab.YOUR_POSITIONS}
        >
          <YourPositions
            positions={(searchByTerm(positions) as Position[]) || []}
            loading={isPositionLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<Trans>Locked Positions</Trans>}
          key={LiquidityTab.LOCKED_POSITIONS}
        />
      </LiquidityTabs>
    </Page>
    //   <PoolPageWrapper
    //   isWalletConnected={isWalletConnected}
    //   onClick={handleAddLiquidity}
    //   isCurrentTabDefault={isCurrentTabDefault}
    //   isCardano={isCommunityPoolsShown}
    // >
    //   <Tabs
    //     tabBarExtraContent={{
    //       right: (
    //         <Input
    //           onChange={handleSearchChange}
    //           prefix={<SearchOutlined />}
    //           placeholder={t`Type token name or pool id`}
    //           size="large"
    //           style={{ width: 300 }}
    //         />
    //       ),
    //     }}
    //     defaultActiveKey={String(query.active)}
    //     className="pool__position-tabs"
    //     onChange={(key) => {
    //       navigate(`?active=${key}`);
    //     }}
    //   >
    //     <Tabs.TabPane
    //       tab={<Trans>Pools Overview</Trans>}
    //       key={defaultActiveTabKey}
    //     >
    //       <LiquidityPositionsList
    //         totalCount={pools.length}
    //         pools={filterCommunityPools(pools.filter((p) => p.match(term)))}
    //         loading={isPoolsLoading}
    //       />
    //     </Tabs.TabPane>
    //     <Tabs.TabPane tab={<Trans>Your Positions</Trans>} key="your-positions">
    //       {isWalletConnected ? (
    //         <LiquidityPositionsList
    //           totalCount={positions.length}
    //           pools={positions.map((p) => p.pool).filter((p) => p.match(term))}
    //           loading={isBalanceLoading || isPositionLoading}
    //         />
    //       ) : (
    //         <EmptyPositionsList>
    //           <ConnectWalletButton />
    //         </EmptyPositionsList>
    //       )}
    //     </Tabs.TabPane>
    //     {isWalletConnected && positions.some((p) => p.locks.length) && (
    //       <Tabs.TabPane
    //         tab={<Trans>Locked Positions</Trans>}
    //         key="locked-positions"
    //       >
    //         <LockListView
    //           positions={positions.filter(
    //             (p) => !!p.locks.length && p.match(term),
    //           )}
    //         />
    //       </Tabs.TabPane>
    //     )}
    //   </Tabs>
    //   <IsErgo>
    //     {isCurrentTabDefault && (
    //       <Flex justify="center" align="center">
    //         <Button size="large" type="link" onClick={handleShowCommunityPools}>
    //           {t`${isCommunityPoolsShown ? 'Hide' : 'Show'} Community Pools`}
    //         </Button>
    //       </Flex>
    //     )}
    //   </IsErgo>
    // </PoolPageWrapper>
  );
};
