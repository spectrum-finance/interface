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
            This pool contains a minor bug! We advise to migrate liquidity from
            this pool.
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
