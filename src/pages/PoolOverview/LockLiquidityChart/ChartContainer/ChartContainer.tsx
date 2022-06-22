import { Collapse } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface ChartCollapseProps {
  header?: ReactNode | ReactNode[] | string;
  disabled?: boolean;
  children?: ReactNode | ReactNode[] | string;
  className?: string;
  onChange?: () => void;
}

const _ChartContainer: FC<ChartCollapseProps> = ({
  header,
  children,
  className,
  onChange,
}) => (
  <Collapse className={className} onChange={onChange}>
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
  border: 1px solid var(--ergo-box-border-color);

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
