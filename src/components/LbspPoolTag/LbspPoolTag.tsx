import {
  Flex,
  InfoCircleOutlined,
  Tooltip,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import styled from 'styled-components';

const LbspPoolTagWrapper = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #ffffff;
  background: linear-gradient(71.04deg, #3b41c5 0%, #a981bb 49%, #ff7c32 100%);
  padding: 2px 8px;
  border-radius: 6px;
`;
export const LbspPoolTag = () => (
  <LbspPoolTagWrapper>
    <Tooltip
      width={300}
      title={
        <Flex col>
          <Flex.Item>
            <Trans>
              This Liquidity Pool delegates ADA to the LBSP. Provide Liquidity
              to be rewarded in SPF token
            </Trans>
          </Flex.Item>
          <Flex.Item>
            <Trans>0.012 SPF per 1 delegated ADA per epoch</Trans>
          </Flex.Item>
          <Flex.Item>
            <Typography.Link target="_blank" href="https://google.com">
              <Trans>Read more</Trans>
            </Typography.Link>
          </Flex.Item>
        </Flex>
      }
    >
      <Flex>
        <Flex.Item marginRight={1}>✨LBSP</Flex.Item>
        <Flex.Item>
          <InfoCircleOutlined />
        </Flex.Item>
      </Flex>
    </Tooltip>
  </LbspPoolTagWrapper>
);
