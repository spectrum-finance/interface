import React, { FC } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { NetworkDomManager } from './common/services/NetworkDomManager';
import { Layout } from './components/common/Layout/Layout';
import { RouteConfigExtended } from './components/RouterTitle/RouteConfigExtended';
import { RouterTitle } from './components/RouterTitle/RouterTitle';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Farms } from './pages/Farms/Farms';
import { Liquidity } from './pages/Liquidity/Liquidity';
import { LockLiquidity } from './pages/LockLiquidity/LockLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { RelockLiquidity } from './pages/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity/RemoveLiquidity';
import { Swap } from './pages/Swap/Swap';
import { WithdrawalLiquidity } from './pages/WithdrawalLiquidity/WithdrawalLiquidity';

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
            element: <Navigate to="swap" />,
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
                element: <AddLiquidityOrCreatePool />,
              },
              {
                title: 'Create Pool',
                path: 'create',
                element: <AddLiquidityOrCreatePool />,
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
                    element: <AddLiquidityOrCreatePool />,
                  },
                  {
                    title: 'Create Pool',
                    path: 'create',
                    element: <AddLiquidityOrCreatePool />,
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
  const networkTitle = NetworkDomManager.useNetworkTitle();

  return (
    <>
      <RouterTitle
        divider="·"
        pageTitle={networkTitle ? `Spectrum · ${networkTitle}` : 'Spectrum'}
        routesConfig={routesConfig}
      />
      {routes}
    </>
  );
};
