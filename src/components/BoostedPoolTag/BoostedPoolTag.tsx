import { Flex, Tag } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo.ts';
import { AssetIcon } from '../AssetIcon/AssetIcon.tsx';

interface BoostedPoolTagProps {
  asset: AssetInfo;
}

export const BoostedPoolTag: FC<BoostedPoolTagProps> = ({ asset }) => {
  return (
    <Tag color="geekblue">
      <Flex align="center">
        <Flex.Item marginRight={1}>
          <AssetIcon asset={asset} size="extraSmall" />
        </Flex.Item>
        <Trans>Boosted</Trans>
      </Flex>
    </Tag>
  );
};
