import {
  Button,
  CalculatorOutlined,
  Flex,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';

import { LbspCalculatorModal } from '../LbspCalculatorModal/LbspCalculatorModal';
import { LbspFaqModal } from '../LbspFaqModal/LbspFaqModal';
import { LbspTimer } from './LbspTimer/LbspTimer';
import TokensImg from './tokens-img.png';

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
                <Trans>Add liquidity and Get Rewarded</Trans>
              </Typography.Title>
              <Typography.Title level={5} style={{ fontWeight: 400 }}>
                <Trans>
                  Provide liquidity to &quot;LBSP-labeled&quot; pools and get
                  rewarded with SPF utility token.
                </Trans>
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <LbspTimer />
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Flex.Item marginRight={2}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalculatorOutlined />}
                    onClick={() =>
                      Modal.open(({ close }) => (
                        <LbspCalculatorModal close={close} />
                      ))
                    }
                  >
                    Calculator
                  </Button>
                </Flex.Item>
                <Flex.Item>
                  <Button
                    size="large"
                    onClick={() => {
                      Modal.open(() => <LbspFaqModal />);
                    }}
                  >
                    <Trans>What is LBSP?</Trans>
                  </Button>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </LbspBannerContent>
        <img src={TokensImg} alt="tokens-img" />
      </LbspBannerWrapper>
    </>
  );
};
