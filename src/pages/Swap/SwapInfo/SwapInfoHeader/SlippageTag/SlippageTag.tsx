import { Box, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';

import { useSettings } from '../../../../../gateway/settings/settings';

interface SlippageTagProps {
  className?: string;
}

const _SlippageTag: FC<SlippageTagProps> = ({ className }) => {
  const { slippage } = useSettings();

  return (
    <Box padding={[0.5, 1]} className={className}>
      <Typography.Body>
        <Trans>Slippage: {slippage}</Trans>%
      </Typography.Body>
    </Box>
  );
};

export const SlippageTag = styled(_SlippageTag)`
  background: var(--spectrum-swap-slippage-tag);
  font-size: 12px;
  line-height: 20px;
`;
