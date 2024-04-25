import { FC } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { NetworkDomManager } from './common/services/NetworkDomManager/NetworkDomManager';
import { Layout } from './components/common/Layout/Layout';
import { RouteConfigExtended } from './components/RouterTitle/RouteConfigExtended';
import { RouterTitle } from './components/RouterTitle/RouterTitle';
import { AddLiquidity } from './pages/AddLiquidity/AddLiquidity';
import { CreatePool } from './pages/CreatePool/CreatePool';
import { Farms } from './pages/Farms/Farms';
import { IspoRewards } from './pages/IspoRewards/IspoRewards.tsx';
import { Liquidity } from './pages/Liquidity/Liquidity';
import { LockLiquidity } from './pages/LockLiquidity/LockLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { RelockLiquidity } from './pages/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity/RemoveLiquidity';
import { Rewards } from './pages/Rewards/Rewards';
import { Swap } from './pages/Swap/Swap';
import { WithdrawalLiquidity } from './pages/WithdrawalLiquidity/WithdrawalLiquidity';
import { isPreLbspTimeGap } from './utils/lbsp.ts';

export const routesConfig: RouteConfigExtended[] = [
  {
    path: '/',
    element: <NetworkDomManager.Outlet />,
    children: [
      {
        path: `:network`,
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          {
            path: '',
            element: isPreLbspTimeGap() ? (
              <Navigate to="liquidity" />
            ) : (
              <Navigate to="swap" />
            ),
          },
          {
            title: 'Swap',
            path: 'swap',
            element: <Swap />,
          },
          {
            title: 'Farm',
            path: 'farm',
            element: <Farms />,
          },
          {
            path: 'liquidity',
            children: [
              {
                title: 'Liquidity',
                path: '',
                element: <Liquidity />,
              },
              {
                title: 'Add Liquidity',
                path: 'add',
                element: <AddLiquidity />,
              },
              {
                title: 'Create Pool',
                path: 'create',
                element: <CreatePool />,
              },
              {
                path: ':poolId',
                children: [
                  {
                    title: 'Remove Liquidity',
                    path: 'remove',
                    element: <RemoveLiquidity />,
                  },
                  {
                    title: 'Lock Liquidity',
                    path: 'lock',
                    element: <LockLiquidity />,
                  },
                  {
                    title: 'Relock Liquidity',
                    path: 'relock',
                    element: <RelockLiquidity />,
                  },
                  {
                    title: 'Withdrawal Liquidity',
                    path: 'withdrawal',
                    element: <WithdrawalLiquidity />,
                  },
                  {
                    title: 'Add Liquidity',
                    path: 'add',
                    element: <AddLiquidity />,
                  },
                  {
                    title: 'Pool Overview',
                    path: '',
                    element: <PoolOverview />,
                  },
                ],
              },
            ],
          },
          {
            title: 'Rewards',
            path: 'rewards',
            children: [
              {
                path: '',
                element: <Rewards />,
              },
              {
                title: 'ISPO Rewards',
                path: 'ispo',
                element: <IspoRewards />,
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="swap" />,
          },
        ],
      },
    ],
  },
];

export const ApplicationRoutes: FC = () => {
  const routes = useRoutes(routesConfig);

  return (
    <>
      <RouterTitle
        divider="·"
        pageTitle={'ErgoDEX'}
        routesConfig={routesConfig}
      />
      {routes}
    </>
  );
};
