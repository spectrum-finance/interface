import { t } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '../../../ergodex-cdk';

interface MatchParams {
  page: string;
  id: string;
}

interface NavigationProps {
  className?: string;
}

const _Navigation: FC<NavigationProps> = ({ className }) => {
  const history = useHistory();
  const matchRoot = useRouteMatch<MatchParams>('/:page');
  const matchPoolPosition = useRouteMatch<MatchParams>('/pool/:id');
  const matchRemovePosition = useRouteMatch<MatchParams>('/remove/:id');

  const [defaultActiveKey, setDefaultActiveKey] = useState('');

  useEffect(() => {
    if (matchPoolPosition || matchRemovePosition) {
      setDefaultActiveKey('pool');
      return;
    }

    setDefaultActiveKey(
      matchRoot && matchRoot.isExact ? matchRoot.params.page : 'swap',
    );
  }, [matchPoolPosition, matchRemovePosition, matchRoot]);

  const onTabClick = (key: string) => history.push(`/${key}`);

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
