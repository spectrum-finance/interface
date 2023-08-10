import { fireAnalyticsEvent, getBrowser, user } from '@spectrumlabs/analytics';
import { DateTime } from 'luxon';
import { FC, useEffect } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { version } from '../package.json';
import { NetworkDomManager } from './common/services/NetworkDomManager/NetworkDomManager';
import { showCardanoDisclaimerModal } from './components/CardanoDisclaimerModal/CardanoDisclaimerModal.tsx';
import { Layout } from './components/common/Layout/Layout';
import { RouteConfigExtended } from './components/RouterTitle/RouteConfigExtended';
import { RouterTitle } from './components/RouterTitle/RouterTitle';
import { useApplicationSettings } from './context';
import { AddLiquidity } from './pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidity';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Farms } from './pages/Farms/Farms';
import { Liquidity } from './pages/Liquidity/Liquidity';
import { LockLiquidity } from './pages/LockLiquidity/LockLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { RelockLiquidity } from './pages/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity/RemoveLiquidity';
import { Swap } from './pages/Swap/Swap';
import { WithdrawalLiquidity } from './pages/WithdrawalLiquidity/WithdrawalLiquidity';
import { isPreLbspTimeGap } from './utils/lbsp.ts';
import { isCardano } from './utils/network.ts';

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
                    element: <AddLiquidity />,
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

  const [settings] = useApplicationSettings();

  useEffect(() => {
    fireAnalyticsEvent('App Loaded');

    setUserDefaultProps();
    setUserCohort();

    user.set('theme_active', settings.theme);
    user.set('locale_active', settings.lang);

    if (isCardano()) {
      showCardanoDisclaimerModal(settings);
    }
  }, []);

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

function setUserDefaultProps(): void {
  user.set('browser', getBrowser());
  user.set('user_agent', navigator.userAgent);
  user.set('screen_resolution_height', window.screen.height);
  user.set('screen_resolution_width', window.screen.width);
}

function setUserCohort(): void {
  user.setOnce('cohort_date', DateTime.now().toUTC().toFormat('yyyy.MM.dd'));
  user.setOnce('cohort_day', DateTime.now().toUTC().ordinal);
  user.setOnce('cohort_month', DateTime.now().toUTC().month);
  user.setOnce('cohort_year', DateTime.now().toUTC().year);
  user.setOnce('cohort_version', version);
}
