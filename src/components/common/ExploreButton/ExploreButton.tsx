import './ExploreButton.less';

import { Address, TxId } from '@ergolabs/ergo-sdk';
import React from 'react';

import { ReactComponent as ExploreIcon } from '../../../assets/icons/icon-explore.svg';
import { Button, Tooltip } from '../../../ergodex-cdk';
import { exploreAddress, exploreTx } from '../../../utils/redirect';
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
    <Tooltip title="View on explorer">
      <Button
        className="explore-button"
        type="text"
        onClick={() => handleExplore(to)}
      >
        <ExploreIcon />
      </Button>
    </Tooltip>
  );
};

export { ExploreButton };
