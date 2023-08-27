import { Flex, Tag, Tooltip } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export const DeprecatedPoolTag: FC = () => (
  <Tooltip
    width={200}
    title={
      <Flex col>
        <Flex.Item>
          <Trans>
            A more secure variant of this pool is available. We advise you to
            migrate your liquidity to a new one.
          </Trans>
        </Flex.Item>
      </Flex>
    }
  >
    <Tag color="warning">
      <Trans>Deprecated</Trans>
    </Tag>
  </Tooltip>
);
