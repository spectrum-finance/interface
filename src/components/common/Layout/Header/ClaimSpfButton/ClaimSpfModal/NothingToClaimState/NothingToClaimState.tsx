import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { useSelectedNetwork } from '../../../../../../../gateway/common/network';
import { ReactComponent as SpfTokenIcon } from '../../spf-token.svg';

export interface NothingToClaimStateProps {
  readonly close: () => void;
}

export const NothingToClaimState: FC<NothingToClaimStateProps> = ({
  close,
}) => {
  const navigate = useNavigate();
  const matchLiquidityPage = useMatch({
    path: ':network/liquidity',
    end: false,
  });

  const [network] = useSelectedNetwork();

  const handleAddLiquidityButton = () => {
    if (!matchLiquidityPage) {
      navigate(
        `${network.name}/liquidity/f40afb6f877c40a30c8637dd5362227285738174151ce66d6684bc1b727ab6cf`,
      );
    }
    close();
  };

  return (
    <Flex col align="center">
      <Flex.Item marginTop={10} marginBottom={10}>
        <SpfTokenIcon />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Title level={4}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <Trans>Didn't get SPF?</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body size="large" align="center">
          <Trans>
            Don’t worry. You still can earn it by providing liquidity and
            staking LP tokens in farms!
          </Trans>
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={6}>
        <Button type="link" href="https://spectrum.fi/token" target="_blank">
          <Trans>Read more about SPF</Trans>
        </Button>
      </Flex.Item>
      <Button
        size="extra-large"
        style={{ width: '100%' }}
        type="primary"
        onClick={handleAddLiquidityButton}
      >
        <Trans>Add Liquidity</Trans>
      </Button>
    </Flex>
  );
};
