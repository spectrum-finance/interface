import { Flex, Spin } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { TagTypography } from '../TagTypography/TagTypography';

export const LoadingContent: FC = () => (
  <Flex align="center">
    <Flex.Item marginRight={2}>
      <Spin
        size="small"
        style={{ color: 'var(--spectrum-connect-wallet-address-tag-color)' }}
      />
    </Flex.Item>
    <TagTypography>{t`Loading`}</TagTypography>
  </Flex>
);
