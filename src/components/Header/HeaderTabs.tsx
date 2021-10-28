import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Tabs } from '../../ergodex-cdk';

interface MatchParams {
  page: string;
}

const HeaderTabs = (): JSX.Element => {
  const history = useHistory();
  const match = useRouteMatch<MatchParams>('/:page');

  const onTabClick = (activeKey: string) => {
    history.push(activeKey);
  };

  return (
    <div className="header__tabs">
      <Tabs
        defaultActiveKey={match && match.isExact ? match.params.page : 'swap'}
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
