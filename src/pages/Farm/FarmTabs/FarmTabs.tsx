import { Tabs } from '@ergolabs/ui-kit';
import React from 'react';
import styled from 'styled-components';

export const FarmTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
    margin-right: calc(var(--spectrum-base-gutter) * 2);
  }

  .ant-tabs-nav {
    margin-bottom: calc(var(--spectrum-base-gutter) * 2) !important;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;
