import React, { FC } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { RouteConfigExtended } from './components/RouterTitle/RouteConfigExtended';
import { RouterTitle } from './components/RouterTitle/RouterTitle';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Liquidity } from './pages/Pool/Liquidity';
import { LockLiquidity } from './pages/Pool/LockLiquidity/LockLiquidity';
import { RelockLiquidity } from './pages/Pool/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/Pool/RemoveLiquidity/RemoveLiquidity';
import { WithdrawalLiquidity } from './pages/Pool/WithdrawalLiquidity/WithdrawalLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { Swap } from './pages/Swap/Swap';

const routesConfig: RouteConfigExtended[] = [
  {
    path: '/',
    element: <Navigate to="swap" />,
  },
  {
    title: 'Swap',
    path: '/swap',
    element: <Swap />,
  },
  {
    path: '/pool',
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
        title: 'Create Liquidity',
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
    element: <Navigate to="/" />,
  },
];

// console.log(getRoutePath(routesConfig, '/pool/add'));

export const ApplicationRoutes: FC = () => {
  const routes = useRoutes(routesConfig);

  return (
    <>
      <RouterTitle pageTitle="ErgoDex" routesConfig={routesConfig} />
      {routes}
    </>
  );
};
