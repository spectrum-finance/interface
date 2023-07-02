import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Spin } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';

import { useSettings } from '../../../gateway/settings/settings';
import { splitStr } from '../../../utils/string/splitStr';
import { CopyButton } from '../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../common/ExploreButton/ExploreButton';
import { InfoTooltip } from '../../InfoTooltip/InfoTooltip';
import { SensitiveContent } from '../../SensitiveContent/SensitiveContent.tsx';

export const WalletActiveAddress = (): JSX.Element => {
  const { address } = useSettings();
  const [addressBegin, addressSuffix] = splitStr(address);

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <InfoTooltip
          secondary
          content={t`All output assets will be received at this address.`}
        >
          <Typography.Body strong>
            <Trans>Active address</Trans>
          </Typography.Body>
        </InfoTooltip>
      </Flex.Item>
      <Box padding={[3, 4]} borderRadius="l" secondary>
        {address ? (
          <Flex align="center">
            <Flex.Item marginRight={2} style={{ width: 1 }} flex={1}>
              <SensitiveContent>
                <Typography.Title
                  level={4}
                  ellipsis={{
                    rows: 1,
                    suffix: addressSuffix,
                  }}
                >
                  {addressBegin}
                </Typography.Title>
              </SensitiveContent>
            </Flex.Item>
            <Flex.Item marginRight={1} display="flex">
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
        ) : (
          <Spin size="small" />
        )}
      </Box>
    </Flex>
  );
};
