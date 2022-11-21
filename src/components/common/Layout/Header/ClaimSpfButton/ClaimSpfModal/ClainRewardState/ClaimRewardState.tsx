import {
  Alert,
  Button,
  Flex,
  InfoCircleFilled,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { claimSpf } from '../../../../../../../network/ergo/api/spfFaucet/claimSpf';
import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';
import { RewardInfo } from '../RewartInfo/RewardInfo';

const Link = styled(Button)`
  padding: 0;
`;

export interface ClaimRewardStateProps {
  readonly reward: SpfReward;
}

export const ClaimRewardState: FC<ClaimRewardStateProps> = ({ reward }) => {
  const [loading, setLoading] = useState(false);

  const action = () => {
    setLoading(true);
    claimSpf().subscribe(() => {
      setLoading(false);
    });
  };

  return (
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
      <Button
        type="primary"
        size="extra-large"
        onClick={action}
        loading={loading}
      >
        {t`Request SPF rewards`}
      </Button>
    </Flex>
  );
};
