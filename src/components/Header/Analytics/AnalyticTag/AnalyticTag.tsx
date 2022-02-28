import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Box } from '../../../../ergodex-cdk';

interface AnalyticTag {
  className?: string;
  children?: ReactNode | ReactNode[] | string;
}

const _AnalyticTag: FC<AnalyticTag> = ({ className, children }) => (
  <Box padding={[1, 2]} borderRadius="s" contrast className={className}>
    {children}
  </Box>
);

export const AnalyticTag = styled(_AnalyticTag)`
  background: var(--ergo-app-analytic-tag);
`;
