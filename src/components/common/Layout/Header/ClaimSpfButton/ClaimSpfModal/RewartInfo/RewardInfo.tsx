import { Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

const ModalAccentBg = styled.div`
  background: var(--spectrum-claim-spf-background);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  height: 306px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
`;

const StyledFlex = styled(Flex)`
  position: relative;
  z-index: 1;
`;

export const RewardInfo: FC = () => (
  <>
    <ModalAccentBg />
    <StyledFlex col>
      <Flex.Item
        display="flex"
        justify="space-between"
        marginBottom={2}
        marginTop={4}
      >
        <Typography.Title>189,500.000000</Typography.Title>
        <Typography.Title>SPF</Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Divider />
      </Flex.Item>
      <Flex.Item display="flex" justify="space-between" marginBottom={2}>
        <Typography.Body strong size="large">
          <Trans>Beta tester:</Trans>
        </Typography.Body>
        <Typography.Body strong size="large">
          134.56,00001 SPF
        </Typography.Body>
      </Flex.Item>
      <Flex.Item display="flex" justify="space-between" marginBottom={2}>
        <Typography.Body strong size="large">
          <Trans>Early off-chain operator:</Trans>
        </Typography.Body>
        <Typography.Body strong size="large">
          134.56,00001 SPF
        </Typography.Body>
      </Flex.Item>
      <Flex.Item display="flex" justify="space-between" marginBottom={2}>
        <Typography.Body strong size="large">
          <Trans>Liquidity provider:</Trans>
        </Typography.Body>
        <Typography.Body strong size="large">
          134.56,00001 SPF
        </Typography.Body>
      </Flex.Item>
      <Flex.Item display="flex" justify="space-between" marginBottom={2}>
        <Typography.Body strong size="large">
          <Trans>Trader:</Trans>
        </Typography.Body>
        <Typography.Body strong size="large">
          134.56,00001 SPF
        </Typography.Body>
      </Flex.Item>
      <Flex.Item display="flex" justify="space-between" marginBottom={4}>
        <Typography.Body strong size="large">
          <Trans>Off-chain operator:</Trans>
        </Typography.Body>
        <Typography.Body strong size="large">
          134.56,00001 SPF
        </Typography.Body>
      </Flex.Item>
    </StyledFlex>
  </>
);
