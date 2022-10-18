import { Button, DownOutlined, Flex, Tabs, useDevice } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { FarmState, FarmStateCaptions } from './FarmState';

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
  width: 100%;

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

export interface FarmStateFilterProps {
  readonly value: FarmState;
  readonly onChange: (value: FarmState) => void;
}

export const FarmStateFilter: FC<FarmStateFilterProps> = ({
  value,
  onChange,
}) => {
  const { moreThan, s } = useDevice();

  return (
    <>
      {s && (
        <MobileSelect size="large">
          <Flex align="center">
            <Flex.Item flex={1} display="flex" justify="flex-start">
              {FarmStateCaptions[value]}
            </Flex.Item>
            <DownOutlined />
          </Flex>

          <select>
            <option value={FarmState.All}>
              {FarmStateCaptions[FarmState.All]}
            </option>
            <option value={FarmState.Live}>
              {FarmStateCaptions[FarmState.Live]}
            </option>
            <option value={FarmState.Scheduled}>
              {FarmStateCaptions[FarmState.Scheduled]}
            </option>
            <option value={FarmState.Finished}>
              {FarmStateCaptions[FarmState.Finished]}
            </option>
          </select>
        </MobileSelect>
      )}
      {moreThan('m') && (
        <Container>
          <StyledTabs activeKey={value} onChange={onChange as any}>
            <StyledTabs.TabPane
              tab={FarmStateCaptions[FarmState.All]}
              key={FarmState.All}
            />
            <StyledTabs.TabPane
              tab={FarmStateCaptions[FarmState.Live]}
              key={FarmState.Live}
            />
            <StyledTabs.TabPane
              tab={FarmStateCaptions[FarmState.Scheduled]}
              key={FarmState.Scheduled}
            />
            <StyledTabs.TabPane
              tab={FarmStateCaptions[FarmState.Finished]}
              key={FarmState.Finished}
            />
          </StyledTabs>
        </Container>
      )}
    </>
  );
};
