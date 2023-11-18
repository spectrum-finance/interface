import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FarmAction } from '../../common/FarmAction/FarmAction';

export interface FarmActionColumnProps {
  readonly farm: Farm;
}

export const FarmActionColumn: FC<FarmActionColumnProps> = ({ farm }) => (
  <Flex width="100%" justify="flex-end">
    <ConnectWalletButton size="middle">
      <FarmAction farm={farm} />
    </ConnectWalletButton>
  </Flex>
);
