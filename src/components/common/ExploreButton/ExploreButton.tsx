import './ExploreButton.less';

import { Address, TxId } from '@ergolabs/ergo-sdk';
import { t } from '@lingui/macro';
import cn from 'classnames';
import React, { ReactNode } from 'react';

import { ReactComponent as ExploreIcon } from '../../../assets/icons/icon-explore.svg';
import { Button, Tooltip } from '../../../ergodex-cdk';
import { exploreAddress, exploreTx } from '../../../utils/redirect';
import { isTxId } from '../../../utils/string/txId';

interface ExploreButtonProps {
  to: Address | TxId;
  children?: ReactNode | string;
}

const ExploreButton: React.FC<ExploreButtonProps> = ({ to, children }) => {
  const handleExplore = (t: string): void => {
    if (isTxId(t)) {
      exploreTx(t);
      return;
    }
    exploreAddress(t);
  };

  return (
    <Tooltip title={t`View on explorer.`} trigger={children ? 'none' : 'hover'}>
      <Button
        className={cn(
          'explore-button',
          children ? 'explore-button--with-children' : '',
        )}
        type="text"
        onClick={() => handleExplore(to)}
        icon={<ExploreIcon />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export { ExploreButton };
