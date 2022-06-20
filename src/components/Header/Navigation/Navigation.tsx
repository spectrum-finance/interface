import { t } from '@lingui/macro';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '../../../ergodex-cdk';

interface NavigationProps {
  className?: string;
  style?: CSSProperties;
}

const _Navigation: FC<NavigationProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const matchLiquidityPage = useMatch({ path: ':network/pool', end: false });

  const [defaultActiveKey, setDefaultActiveKey] = useState('');

  useEffect(() => {
    setDefaultActiveKey(matchLiquidityPage ? 'pool' : 'swap');
  }, [matchLiquidityPage]);

  const onTabClick = (key: string) => navigate(key);

  return (
    <Tabs
      activeKey={defaultActiveKey}
      onChange={onTabClick}
      className={className}
      style={style}
    >
      <Tabs.TabPane tab={t`Swap`} key="swap" />
      <Tabs.TabPane tab={t`Liquidity`} key="pool" />
    </Tabs>
  );
};

export const Navigation = styled(_Navigation)`
  .ant-tabs-nav-list {
    height: 40px;
  }
  //.ant-tabs-tab,
  //.ant-tabs-nav-list {
  //  flex-grow: 1;
  //}

  .ant-tabs-tab-btn {
    font-size: 16px;
    line-height: 22px;
  }
`;
