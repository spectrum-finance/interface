import './HeaderTabs.less';

import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Tabs } from '../../../ergodex-cdk';

interface MatchParams {
  page: string;
  id: string;
}

const HeaderTabs = (): JSX.Element => {
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
    <div className="header-tabs">
      <Tabs activeKey={defaultActiveKey} type="card" onChange={onTabClick}>
        <Tabs.TabPane tab="Swap" key="swap" />
        <Tabs.TabPane tab="Liquidity" key="pool" />
        {/*<Tabs.TabPane tab="Exchange" key="exchange" disabled />*/}
      </Tabs>
    </div>
  );
};

export { HeaderTabs };
