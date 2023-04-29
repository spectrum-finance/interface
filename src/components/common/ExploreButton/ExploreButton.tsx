import { Address, TxId } from '@ergolabs/ergo-sdk';
import { Button, ButtonProps, Icon, Tooltip } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import * as React from 'react';

import { ReactComponent as ExploreIcon } from '../../../assets/icons/icon-explore.svg';
import {
  exploreAddress,
  exploreTx,
} from '../../../gateway/utils/exploreAddress';
import { isTxId } from '../../../utils/string/txId';

interface ExploreButtonProps {
  to: Address | TxId;
  size?: ButtonProps['size'];
}

const ExploreButton: React.FC<ExploreButtonProps> = ({
  to,
  size = 'small',
}) => {
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
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          handleExplore(to);
        }}
        style={{ lineHeight: '24px' }}
        icon={<Icon component={ExploreIcon} />}
      />
    </Tooltip>
  );
};

export { ExploreButton };
