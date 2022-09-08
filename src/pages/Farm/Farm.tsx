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
import { CreateFarmModal } from './CreateFarmModal/CreateFarmModal';
import { FarmGridView } from './FarmGridView/FarmGridView';
import { FarmTableView } from './FarmTableView/FarmTableView';
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
  const [searchByTerm, setSearch, term] = useSearch<
    AmmPool | Position | AssetLock
  >(matchItem);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearch(e.target.value);

  const [ammPools, isAmmPoolsLoading] = useObservable(ammPools$, [], []);

  const openCreteFarmModal = () => {
    openConfirmationModal(
      (next) => <CreateFarmModal onClose={next} pools={ammPools} />,
      Operation.CREATE_FARM,
      {},
    );
  };

  return (
    <Page maxWidth={1100} title={<Trans>Farm</Trans>} padding={0} transparent>
      <IconTabs
        activeKey={viewMode}
        onChange={setViewMode as any}
        tabBarExtraContent={{
          right: (
            <Flex>
              <Flex.Item marginRight={6} marginLeft={6} alignSelf="center">
                <FarmSwitch
                  defaultChecked
                  checkedChildren="All farms"
                  unCheckedChildren="My farms"
                />
              </Flex.Item>
              <Flex.Item marginRight="auto">
                <FarmStateTabs
                  activeKey={activeState}
                  onChange={setActiveState as any}
                >
                  <Tabs.TabPane
                    tab={FarmStateCaptions[FarmState.All]}
                    key={FarmState.All}
                  />
                  <Tabs.TabPane
                    tab={FarmStateCaptions[FarmState.Live]}
                    key={FarmState.Live}
                  />
                  <Tabs.TabPane
                    tab={FarmStateCaptions[FarmState.Scheduled]}
                    key={FarmState.Scheduled}
                  />
                  <Tabs.TabPane
                    tab={FarmStateCaptions[FarmState.Finished]}
                    key={FarmState.Finished}
                  />
                </FarmStateTabs>
              </Flex.Item>
              <Flex.Item flex={1} marginLeft={2} marginRight={2} maxWidth={320}>
                <SearchInput
                  autoFocus
                  onChange={handleSearchChange}
                  value={term}
                  placeholder={t`Search`}
                  size="large"
                  style={{ height: '40px' }}
                />
              </Flex.Item>
              <Button
                type="primary"
                style={{ height: '40px' }}
                onClick={() => openCreteFarmModal()}
              >
                <Trans>Create Farm</Trans>
              </Button>
            </Flex>
          ),
        }}
      >
        <Tabs.TabPane
          tab={<AppstoreOutlined size={16} />}
          key={FarmViewMode.Grid}
        >
          <FarmGridView loading={isAmmPoolsLoading} items={ammPools} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<BarsOutlined size={16} />} key={FarmViewMode.Table}>
          <FarmTableView
            loading={isAmmPoolsLoading}
            items={ammPools}
            expandComponent={React.Fragment}
          />
        </Tabs.TabPane>
      </IconTabs>
    </Page>
  );
};
