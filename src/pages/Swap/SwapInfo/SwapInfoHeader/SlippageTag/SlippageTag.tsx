import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

import { useSettings } from '../../../../../context';
import { Box, Typography } from '../../../../../ergodex-cdk';

interface SlippageTagProps {
  className?: string;
}

const _SlippageTag: FC<SlippageTagProps> = ({ className }) => {
  const [{ slippage }] = useSettings();

  return (
    <Box padding={[0.5, 1]} className={className}>
      <Typography.Body>Slippage: {slippage}%</Typography.Body>
    </Box>
  );
};

export const SlippageTag = styled(_SlippageTag)`
  background: var(--ergo-swap-slippage-tag);
  font-size: 12px;
  line-height: 20px;
`;
