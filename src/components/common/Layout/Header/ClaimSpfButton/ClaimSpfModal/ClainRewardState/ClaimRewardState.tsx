import {
  Alert,
  Button,
  Flex,
  InfoCircleFilled,
  Typography,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { claimSpf } from '../../../../../../../network/ergo/api/spfFaucet/claimSpf';
import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ClaimSpfStatusResponse } from '../../../../../../../network/ergo/api/spfFaucet/spfStatus';
import { RewardInfo } from '../RewardInfo/RewardInfo';

const Link = styled(Button)`
  padding: 0;
`;

export interface ClaimRewardStateProps {
  readonly reward: SpfReward;
  readonly status: ClaimSpfStatusResponse;
}

const StyledAlert = styled(Alert)`
  padding: 0.5rem 1rem;

  .ant-alert-icon {
    margin-right: 8px !important;
    position: relative;
    top: 4px;
  }
`;

export const ClaimRewardState: FC<ClaimRewardStateProps> = ({
  reward,
  status,
}) => {
  const [loading, setLoading] = useState(false);

  const action = () => {
    setLoading(true);
    claimSpf().subscribe(() => {
      setLoading(false);
    });
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={8}>
        <RewardInfo reward={reward} status={status} />
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
        <Link type="link" href="https://spectrum.fi/token" target="_blank">
          Read more about SPF
        </Link>
      </Flex.Item>
      <Flex.Item marginBottom={8}>
        <StyledAlert
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
        disabled={!reward.available.isPositive()}
        loading={loading}
      >
        {reward.available.isPositive()
          ? t`Request SPF rewards`
          : t`The next reward is not yet available`}
      </Button>
    </Flex>
  );
};
