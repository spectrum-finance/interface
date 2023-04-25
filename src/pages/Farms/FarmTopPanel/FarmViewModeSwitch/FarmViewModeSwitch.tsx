import { AppstoreOutlined, BarsOutlined, Tabs } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { FarmViewMode } from './FarmViewMode';

const IconTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
  }

  .ant-tabs-tab .anticon {
    margin-right: 0;
  }

  & > .ant-tabs-nav {
    padding: 0;
  }

  .ant-tabs-tab {
    padding: 4px 8px;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

export interface FarmViewModeSwitchProps {
  readonly value: FarmViewMode;
  readonly onChange: (mode: FarmViewMode) => void;
}

export const FarmViewModeSwitch: FC<FarmViewModeSwitchProps> = ({
  value,
  onChange,
}) => {
  return (
    <IconTabs activeKey={value} onChange={onChange as any}>
      <IconTabs.TabPane
        tab={<AppstoreOutlined size={16} />}
        key={FarmViewMode.Table}
      />
      <IconTabs.TabPane
        tab={<BarsOutlined size={16} />}
        key={FarmViewMode.Grid}
      />
    </IconTabs>
  );
};
