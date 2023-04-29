import { Button, DownOutlined, Flex, Tabs, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { SetSearchParamsFn } from '../../../../common/hooks/useSearchParams';
import { FarmTabs } from '../../types/FarmTabs';

export interface MyFarmsFilterProps {
  value: FarmTabs | undefined;
  onChange: SetSearchParamsFn<{
    activeTab?: FarmTabs;
  }>;
}

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    height: 40px;
  }

  .ant-tabs-tab,
  .ant-tabs-nav-list {
    flex-grow: 1;
  }

  .ant-tabs-tab-btn {
    font-size: 16px;
    line-height: 22px;
  }
`;

const MobileSelect = styled(Button)`
  position: relative;
  min-width: 130px;

  select {
    height: 100%;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
  }
`;

const Container = styled.div`
  display: inline-block;
`;

export const MyFarmsFilter: FC<MyFarmsFilterProps> = ({
  value = FarmTabs.AllFarms,
  onChange,
}) => {
  const FarmTabsCaptions = {
    [FarmTabs.AllFarms]: t`All Farms`,
    [FarmTabs.MyFarms]: t`My Farms`,
  };

  const { moreThan, s } = useDevice();

  return (
    <>
      {moreThan('m') && (
        <Container>
          <StyledTabs
            activeKey={value}
            onChange={(activeKey) =>
              onChange({ activeTab: activeKey } as { activeTab: FarmTabs })
            }
          >
            <StyledTabs.TabPane
              tab={FarmTabsCaptions[FarmTabs.AllFarms]}
              key={FarmTabs.AllFarms}
            />
            <StyledTabs.TabPane
              tab={FarmTabsCaptions[FarmTabs.MyFarms]}
              key={FarmTabs.MyFarms}
            />
          </StyledTabs>
        </Container>
      )}
      {s && (
        <MobileSelect size="large">
          <Flex align="center">
            <Flex.Item flex={1} display="flex" justify="flex-start">
              {FarmTabsCaptions[value]}
            </Flex.Item>
            <DownOutlined />
          </Flex>

          <select
            onChange={(e) =>
              onChange({ activeTab: e.target.value } as { activeTab: FarmTabs })
            }
          >
            <option value={FarmTabs.AllFarms}>
              {FarmTabsCaptions[FarmTabs.AllFarms]}
            </option>
            <option value={FarmTabs.MyFarms}>
              {FarmTabsCaptions[FarmTabs.MyFarms]}
            </option>
          </select>
        </MobileSelect>
      )}
    </>
  );
};
