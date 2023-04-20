import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as DarkBannerBgLeft } from './banner-bg-left.svg';
import { ReactComponent as DarkBannerBgRight } from './banner-bg-right.svg';
import { ReactComponent as LinkIcon } from './link.svg';

const BannerBackground = styled.div`
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: -1;
`;

const _YieldFarmingBadge: FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();

  const navigateToFarm = () => {
    navigate('../farm');
  };

  return (
    <Box
      onClick={navigateToFarm}
      padding={[0, 6]}
      className={className}
      borderRadius="xl"
      bordered={false}
      height={74}
      glass
    >
      <BannerBackground>
        <Flex justify="space-between" stretch width="100%">
          <DarkBannerBgLeft />
          <DarkBannerBgRight />
        </Flex>
      </BannerBackground>
      <Flex stretch justify="space-between" align="center">
        <Flex col stretch justify="center">
          <Typography.Title level={4}>
            <Trans>Yield Farming</Trans>
          </Typography.Title>
          <Typography.Body>
            <Trans>Stake your liquidity and get more Ergo assets!</Trans>
          </Typography.Body>
        </Flex>
        <Typography.Body style={{ lineHeight: 0 }}>
          <LinkIcon />
        </Typography.Body>
      </Flex>
    </Box>
  );
};

export const YieldFarmingBadge = styled(_YieldFarmingBadge)`
  background: var(--spectrum-yield-farming-badge-background) !important;
  overflow: hidden;
  position: relative;
  z-index: 1;

  h4,
  span {
    color: var(--spectrum-primary-color) !important;
  }

  &:hover {
    h4,
    span {
      color: var(--spectrum-primary-color-hover) !important;
    }
  }
`;
