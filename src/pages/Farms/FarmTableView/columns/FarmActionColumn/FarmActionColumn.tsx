import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FarmAction } from './FarmAction/FarmAction';

export interface FarmActionColumnProps {
  readonly farm: Farm;
}

export const FarmActionColumn: FC<FarmActionColumnProps> = ({ farm }) => (
  <Flex width="100%" justify="flex-end">
    <ConnectWalletButton size="middle" analytics={{ location: 'farm-table' }}>
      <FarmAction farm={farm} />
    </ConnectWalletButton>
  </Flex>
);
