import { Button, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';

import { LbspFaqModal } from '../LbspFaqModal/LbspFaqModal.tsx';
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
    z-index: 0;

    @media (max-width: 720px) {
      opacity: 0.3;
    }
  }

  & + main {
    padding-top: 24px !important;
  }
`;

const LbspBannerContent = styled.div`
  width: 100%;
  max-width: 1048px;
  padding: 24px;
  z-index: 2;
  @media (max-width: 767px) {
    padding: 24px 8px;
  }
`;

export const LbspBanner = () => {
  return (
    <>
      <LbspBannerWrapper>
        <LbspBannerContent>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <Typography.Title level={3}>
                <Trans>Get Rewarded By Providing Liquidity</Trans>
              </Typography.Title>
              <Typography.Body>
                <Trans>
                  Upon providing liquidity to labeled &quot;LBSP&quot; liquidity
                  pools, ADA will be instantly staked in the Liquidity Bootstrap
                  Stake Pool, resulting in Liquidity Providers receiving twice
                  the SPF rewards compared to the standard ISP.
                </Trans>
              </Typography.Body>
            </Flex.Item>
            <Flex.Item>
              <Button
                type="primary"
                onClick={() => {
                  Modal.open(() => <LbspFaqModal />);
                }}
              >
                <Trans>Learn more about LBSP</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </LbspBannerContent>
        <img src={TokensImg} alt="tokens-img" />
      </LbspBannerWrapper>
    </>
  );
};
