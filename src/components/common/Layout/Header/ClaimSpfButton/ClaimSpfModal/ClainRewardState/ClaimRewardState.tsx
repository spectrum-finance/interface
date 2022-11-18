import {
  Alert,
  Button,
  Flex,
  InfoCircleFilled,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ClaimSpfReward } from '../../../../../../../network/ergo/api/claimSpf/claimSpfReward';
import { RewardInfo } from '../RewartInfo/RewardInfo';

const Link = styled(Button)`
  padding: 0;
`;

export interface ClaimRewardStateProps {
  readonly reward: ClaimSpfReward;
}

export const ClaimRewardState: FC<ClaimRewardStateProps> = ({ reward }) => (
  <Flex col>
    <Flex.Item marginBottom={4}>
      <RewardInfo reward={reward} />
    </Flex.Item>
    <Flex.Item marginBottom={2}>
      <Typography.Body>
        Thanks for being a long time supporter of the Spectrum Finance (former
        ErgoDEX) Protocol. You may request your SPF to be used for protocol
        fees, batcher fees and farm more by staking your liquidity tokens in
        farms.
        <br />
        <br />
        In the future, SPF will have more utility, such as governance,
        cross-chain fee reduction, and staking in Spectrum Network’s consensus
        protocol.
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={2}>
      <Link type="link">Read more about SPF</Link>
    </Flex.Item>
    <Flex.Item marginBottom={6}>
      <Alert
        type="warning"
        showIcon
        icon={<InfoCircleFilled style={{ fontSize: 14 }} />}
        description={
          <Typography.Body>
            Your SPF will be sent to your wallet addresses within 24 hours of
            your request.
          </Typography.Body>
        }
      />
    </Flex.Item>
    <Button type="primary" size="extra-large">
      <Trans>Request SPF rewards</Trans>
    </Button>
  </Flex>
);
