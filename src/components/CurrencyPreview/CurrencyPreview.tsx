import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Currency } from '../../common/models/Currency';
import { AssetTitle } from '../AssetTitle/AssetTitle';

export interface CurrencyPreviewProps {
  readonly label: ReactNode | ReactNode[] | string;
  readonly value: Currency;
}

const StyledButton = styled(Button)`
  padding: 0 calc(var(--spectrum-base-gutter) * 3);
`;

export const CurrencyPreview: FC<CurrencyPreviewProps> = ({ value, label }) => (
  <Box padding={4} secondary>
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body secondary>{label}</Typography.Body>
      </Flex.Item>
      <Flex.Item align="center" display="flex">
        <Flex.Item flex={1}>
          <Typography.Title level={3}>{value.toString()}</Typography.Title>
        </Flex.Item>
        <StyledButton size="large">
          <AssetTitle gap={2} asset={value.asset} />
        </StyledButton>
      </Flex.Item>
    </Flex>
  </Box>
);
