import { Address, TxId } from '@ergolabs/ergo-sdk';
import { Button, Tooltip } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { ReactNode } from 'react';

import { ReactComponent as ExploreIcon } from '../../../assets/icons/icon-explore.svg';
import {
  exploreAddress,
  exploreTx,
} from '../../../gateway/utils/exploreAddress';
import { isTxId } from '../../../utils/string/txId';

interface ExploreButtonProps {
  to: Address | TxId;
}

const ExploreButton: React.FC<ExploreButtonProps> = ({ to }) => {
  const handleExplore = (t: string): void => {
    if (isTxId(t)) {
      exploreTx(t);
      return;
    }
    exploreAddress(t);
  };

  return (
    <Tooltip title={t`View on explorer.`} trigger="hover">
      <Button
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleExplore(to);
        }}
        style={{ lineHeight: '24px' }}
        icon={<ExploreIcon />}
      />
    </Tooltip>
  );
};

export { ExploreButton };
