import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';

const LbspBannerWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 146px;
  background: var(--spectrum-lbsp-banner-background-color);
  margin-top: 94px;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 720px) {
    margin-top: 114px;
  }

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
              <Typography.Title level={1}>
                <Trans>Claim Rewards on TosiDrop</Trans>
              </Typography.Title>
            </Flex.Item>
          </Flex>
        </LbspBannerContent>
      </LbspBannerWrapper>
    </>
  );
};
