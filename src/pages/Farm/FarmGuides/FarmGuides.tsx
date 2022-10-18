import {
  Alert,
  Box,
  Button,
  Flex,
  Gutter,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

const StyledAlert = styled(Alert)`
  background: var(--spectrum-header-gradient-background);
  border: none;
  padding: 0;

  .ant-alert-close-icon {
    color: var(--spectrum-primary-text-contrast) !important;
    top: 10px;
  }
`;

const StyledTitle = styled(Typography.Title)`
  color: var(--spectrum-primary-text-contrast) !important;
`;

const StyledBodyText = styled(Typography.Body)`
  color: var(--spectrum-primary-text-contrast) !important;
`;

export const FarmGuides: FC = () => {
  const { valBySize } = useDevice();

  return (
    <StyledAlert
      className="test"
      closable
      message={
        <Box
          padding={valBySize<Gutter>(4, [4, 4, 4, 6])}
          transparent
          bordered={false}
        >
          <Flex
            justify={valBySize('flex-start', 'space-between')}
            col={valBySize(true, false)}
          >
            <Flex.Item display="flex" col marginBottom={valBySize(2, 0)}>
              <Flex.Item marginBottom={2}>
                <StyledTitle level={4}>
                  <Trans>Earn more tokens from your liquidity positions</Trans>
                </StyledTitle>
              </Flex.Item>
              <StyledBodyText>
                <Trans>Check out our guides how to work with farms</Trans>
              </StyledBodyText>
            </Flex.Item>
            <Flex.Item
              display="flex"
              align={valBySize('flex-start', 'flex-end')}
              justify={valBySize('flex-end', 'flex-start')}
            >
              <Button type="primary">
                <Trans>Read guides</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Box>
      }
    />
  );
};
