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

const matchItem = (
  item: AmmPool | Position | AssetLock,
  term?: string,
): boolean => {
  if (item instanceof AmmPool) {
    return item.match(term);
  }
  if (item instanceof Position) {
    return item.match(term);
  }
  return item.position.match(term);
};

export const Farm = (): JSX.Element => {
  const [{ activeStatus, activeTab }, setSearchParams] =
    useSearchParams<{ activeStatus: FarmState; activeTab: FarmTabs }>();
  const [viewMode, setViewMode] = useState<FarmViewMode>(FarmViewMode.Table);
  const [farmPools, isFarmPoolsLoading] = useObservable(farmPools$, [], []);

  const filteredPools = useMemo(() => {
    let pools = farmPools;

    if (activeStatus && activeStatus !== FarmState.All) {
      pools = farmPools.filter(
        ({ currentStatus }) => currentStatus === activeStatus,
      );
    }

    return pools;
  }, [activeStatus, farmPools]);

  const [searchByTerm, setSearch, term] = useSearch<
    AmmPool | Position | AssetLock
  >(matchItem);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearch(e.target.value);

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
