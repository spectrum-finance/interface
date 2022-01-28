import './ChartContainer.less';

import React, { FC, ReactNode } from 'react';

import { Collapse } from '../../../../../ergodex-cdk';

interface ChartCollapseProps {
  header?: ReactNode | ReactNode[] | string;
  children?: ReactNode | ReactNode[] | string;
}

export const ChartContainer: FC<ChartCollapseProps> = ({
  header,
  children,
}) => (
  <Collapse className="chart-container">
    <Collapse.Panel key="chart" header={header} showArrow={false}>
      {children}
    </Collapse.Panel>
  </Collapse>
);
