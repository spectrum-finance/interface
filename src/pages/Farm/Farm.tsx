import {
  AppstoreOutlined,
  BarsOutlined,
  Button,
  Flex,
  Switch,
  Tabs,
  useSearch,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { useState } from 'react';
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
import { SearchInput } from '../../components/SearchInput/SearchInput';
import { ammPools$ } from '../../gateway/api/ammPools';
import { LiquidityState } from '../Liquidity/common/types/LiquidityState';
import { FarmGridView } from './FarmGridView/FarmGridView';
import { FarmGuides } from './FarmGuides/FarmGuides';
import { FarmTableView } from './FarmTableView/FarmTableView';
import { CreateFarmModal } from './FarmTopPanel/CreateFarmModal/CreateFarmModal';
import { FarmTopPanel } from './FarmTopPanel/FarmTopPanel';
import { FarmState, FarmStateCaptions } from './types/FarmState';
import { FarmViewMode } from './types/FarmViewMode';

const FarmStateTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
  }

  .ant-tabs-tab {
    padding: 4px 16px !important;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

const IconTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
  }

  .ant-tabs-tab .anticon {
    margin-right: 0;
  }

  & > .ant-tabs-nav {
    padding: 24px 0;
  }

  .ant-tabs-tab {
    padding: 4px 8px;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

const FarmSwitch = styled(Switch)`
  border-radius: 4px !important;

  .ant-switch-handle::before {
    border-radius: 4px !important;
  }
`;

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
  const [activeState, setActiveState] = useState<FarmState>(FarmState.All);
  const [viewMode, setViewMode] = useState<FarmViewMode>(FarmViewMode.Table);
  const [{ active }, setSearchParams] =
    useSearchParams<{ active: LiquidityState | undefined }>();
  const [ammPools, isAmmPoolsLoading] = useObservable(ammPools$, [], []);
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
          <FarmTopPanel />
        </Flex.Item>
        <FarmTableView
          loading={isAmmPoolsLoading}
          items={ammPools}
          expandComponent={React.Fragment}
        />
      </Flex>
    </Page>
  );
};
