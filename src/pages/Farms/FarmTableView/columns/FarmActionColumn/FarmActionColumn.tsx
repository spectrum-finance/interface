import { Flex } from '@ergolabs/ui-kit';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FarmAction } from '../../common/FarmAction/FarmAction';

export interface FarmActionColumnProps {
  readonly farm: Farm;
}

export const FarmActionColumn: FC<FarmActionColumnProps> = ({ farm }) => (
  <Flex width="100%" justify="flex-end">
    <ConnectWalletButton
      size="middle"
      trace={{
        element_name: ElementName.connectWalletButton,
        element_location: ElementLocation.farmsList,
      }}
    >
      <FarmAction farm={farm} />
    </ConnectWalletButton>
  </Flex>
);
