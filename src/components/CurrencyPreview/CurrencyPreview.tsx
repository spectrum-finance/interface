import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { Currency } from '../../common/models/Currency';
import { AssetTitle } from '../AssetTitle/AssetTitle';

export interface CurrencyPreviewProps {
  readonly value: Currency;
}

const StyledButton = styled(Button)`
  padding: 0 calc(var(--spectrum-base-gutter) * 3);
`;

export const CurrencyPreview: FC<CurrencyPreviewProps> = ({ value }) => (
  <BoxStyled padding={4} secondary borderRadius="l">
    <Flex col>
      <Flex.Item align="center" display="flex">
        <Flex.Item flex={1}>
          <Typography.Title level={3}>{value.toString()} </Typography.Title>
        </Flex.Item>
        <StyledButton size="large">
          <AssetTitle gap={2} asset={value.asset} />
        </StyledButton>
      </Flex.Item>
    </Flex>
  </BoxStyled>
);

const BoxStyled = styled(Box)`
  .ergo-flex-align-items--center {
    gap: 5px;
  }
`;
