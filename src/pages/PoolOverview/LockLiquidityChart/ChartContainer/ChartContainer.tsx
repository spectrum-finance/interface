import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Collapse } from '../../../../ergodex-cdk';

interface ChartCollapseProps {
  header?: ReactNode | ReactNode[] | string;
  disabled?: boolean;
  children?: ReactNode | ReactNode[] | string;
  className?: string;
}

const _ChartContainer: FC<ChartCollapseProps> = ({
  header,
  children,
  className,
}) => (
  <Collapse className={className}>
    <Collapse.Panel key="chart" header={header} showArrow={false}>
      {children}
    </Collapse.Panel>
  </Collapse>
);

export const ChartContainer = styled(_ChartContainer)`
  padding: 0;
  border: initial;
  background: var(--ergo-box-bg-contrast);
  border-radius: 12px;

  .ant-collapse-header {
    padding: 0 !important;
  }

  .ant-collapse-content {
    border-radius: 12px;
  }

  .ant-collapse-content-box {
    background: var(--ergo-box-bg-contrast);
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  .ant-collapse-content {
    border: initial;
    background: var(--ergo-box-bg-contrast);
  }

  .ant-collapse-item {
    border: initial;
  }
`;
