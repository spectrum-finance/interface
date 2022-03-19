import { t, Trans } from '@lingui/macro';
import React from 'react';

import { useSettings } from '../../../context';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { Spin } from '../../../ergodex-cdk/components/Spin/Spin';
import { getShortAddress } from '../../../utils/string/addres';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';
import { InfoTooltip } from '../../InfoTooltip/InfoTooltip';

export const WalletActiveAddress = (): JSX.Element => {
  const [{ address }] = useSettings();

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Typography.Body strong>
          <Trans>Active address</Trans>
        </Typography.Body>
        <InfoTooltip
          content={t`All output assets will be received at this address.`}
        />
      </Flex.Item>
      <Box padding={[2, 4]} borderRadius="m" contrast>
        {address ? (
          <Flex col>
            <Flex.Item marginBottom={1}>
              <Typography.Title level={4}>
                {address ? getShortAddress(address) : ''}
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginBottom={1}>
              <Flex>
                <Flex.Item marginRight={4} display="flex">
                  <CopyButton text={address}>
                    <Trans>Copy Address</Trans>
                  </CopyButton>
                </Flex.Item>
                <Flex.Item display="flex">
                  <ExploreButton to={address}>
                    <Trans>View on explorer</Trans>
                  </ExploreButton>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        ) : (
          <Spin size="small" />
        )}
      </Box>
    </Flex>
  );
};
