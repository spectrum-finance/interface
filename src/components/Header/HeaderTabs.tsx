import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Tabs } from '../../ergodex-cdk';

interface MatchParams {
  page: string;
  id: string;
}

const HeaderTabs = (): JSX.Element => {
  const history = useHistory();
  const matchRoot = useRouteMatch<MatchParams>('/:page');
  const matchPoolPosition = useRouteMatch<MatchParams>('/pool/:id');
  const onTabClick = (activeKey: string) => {
    history.push('/' + activeKey);
  };

  const getDefaultActiveKey = (): string => {
    if (matchPoolPosition) return 'pool';
    return matchRoot && matchRoot.isExact ? matchRoot.params.page : 'swap';
  };

  return (
    <div className="header__tabs">
      <Tabs
        defaultActiveKey={getDefaultActiveKey()}
        type="card"
        onChange={onTabClick}
      >
        <Tabs.TabPane tab="Swap" key="swap" />
        <Tabs.TabPane tab="Pool" key="pool" />
        <Tabs.TabPane tab="Exchange" key="exchange" disabled />
      </Tabs>
    </div>
  );
};

export { HeaderTabs };
