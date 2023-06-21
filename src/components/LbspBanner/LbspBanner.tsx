import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';

import TokensImg from './tokens-img.png';

const LbspBannerWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 146px;
  background: var(--spectrum-lbsp-banner-background-color);
  margin-top: 72px;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  & img {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }

  & + main {
    padding-top: 24px !important;
  }
`;

const LbspBannerContent = styled.div`
  width: 100%;
  max-width: 1016px;
  padding: 24px 8px;
`;

export const LbspBanner = () => {
  return (
    <>
      <LbspBannerWrapper>
        <LbspBannerContent>
          <Flex col>
            <Flex.Item marginBottom={2}>
              <Typography.Title level={4}>
                <Trans>Get Rewarded by providing liquidity</Trans>
              </Typography.Title>
              <Typography.Title level={5}>
                Join the Liquidity Bootstrap Stake Pool Event (LBSP) and Become
                the First Liquidity Provider!
              </Typography.Title>
            </Flex.Item>
            <Flex.Item>
              <Button type="primary" href="google.com" target="_blank">
                Learn more about LBSP
              </Button>
            </Flex.Item>
          </Flex>
        </LbspBannerContent>
        <img src={TokensImg} alt="tokens-img" />
      </LbspBannerWrapper>
    </>
  );
};
