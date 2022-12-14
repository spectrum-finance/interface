import {
  AppstoreOutlined,
  BarsOutlined,
  Button,
  Flex,
  Switch,
  Tabs,
  useSearch,
} from '@ergolabs/ui-kit';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../common/hooks/useObservable';
import { useSearchParams } from '../../common/hooks/useSearchParams';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { LmPool } from '../../common/models/LmPool';
import { Position } from '../../common/models/Position';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { Page } from '../../components/Page/Page';
import { farmPools$ } from '../../network/ergo/api/lmPools/lmPools';
import { FarmGuides } from './FarmGuides/FarmGuides';
import { FarmTableExpandComponent } from './FarmTableExpandComponent/FarmTableExpandComponent';
import { FarmTableView } from './FarmTableView/FarmTableView';
import { FarmTopPanel } from './FarmTopPanel/FarmTopPanel';
import { FarmState } from './types/FarmState';
import { FarmTabs } from './types/FarmTabs';
import { FarmViewMode } from './types/FarmViewMode';

const matchItem = (item: LmPool | AssetLock, term?: string): boolean => {
  if (item instanceof LmPool) {
    return item.ammPool.match(term);
  }
  if (item instanceof Position) {
    return item.match(term);
  }
  return item.position.match(term);
};

export const Farm = (): JSX.Element => {
  const [{ activeStatus, activeTab, searchString }, setSearchParams] =
    useSearchParams<{
      activeStatus: FarmState;
      activeTab: FarmTabs;
      searchString: string;
    }>();
  const [viewMode, setViewMode] = useState<FarmViewMode>(FarmViewMode.Table);
  const [farmPools, isFarmPoolsLoading] = useObservable(farmPools$, [], []);

  const filteredPools = useMemo(() => {
    let pools = farmPools;

    if (activeStatus && activeStatus !== FarmState.All) {
      pools = pools.filter(
        ({ currentStatus }) => currentStatus === activeStatus,
      );
    }

    if (searchString && searchString.trim() !== '') {
      pools = pools.filter((lmPool) => {
        if (lmPool.ammPool.match(searchString)) {
          return true;
        }

        if (lmPool.id.match(searchString)) {
          return true;
        }

        return false;
      });
    }

    return pools;
  }, [activeStatus, farmPools, searchString]);
  console.log(filteredPools);
  return (
    <Page maxWidth={1110} padding={0} transparent>
      <Flex col>
        <Flex.Item marginBottom={6}>
          <FarmGuides />
        </Flex.Item>
        <Flex.Item marginBottom={6}>
          <FarmTopPanel
            setSearchParams={setSearchParams}
            activeStatus={activeStatus}
            activeTab={activeTab}
            searchString={searchString}
          />
        </Flex.Item>
        <FarmTableView
          loading={isFarmPoolsLoading}
          items={filteredPools}
          expandComponent={FarmTableExpandComponent}
        />
      </Flex>
    </Page>
  );
};
