import { Tabs } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface NavigationProps {
  className?: string;
}

const _Navigation: FC<NavigationProps> = ({ className }) => {
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

  .ant-tabs-tab-btn {
    font-size: 16px;
    line-height: 22px;
  }

  @media (max-width: 768px) {
    position: fixed;
    right: 50%;
    bottom: 1rem;
    transform: translate(50%, 0);
  }
`;
