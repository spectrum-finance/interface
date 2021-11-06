import './TokenListItem.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { useEffect } from 'react';

import { Box, Typography } from '../../../../../ergodex-cdk';
import { useObservableAction } from '../../../../../hooks/useObservable';
import { getTokenBalance } from '../../../../../services/new/wallet';
import { TokenIcon } from '../../../../TokenIcon/TokenIcon';

interface TokenListItemProps {
  asset: AssetInfo;
  iconName?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const TokenListItem: React.FC<TokenListItemProps> = ({
  asset,
  iconName,
  onClick,
}) => {
  const [balance, updateBalance] = useObservableAction(getTokenBalance);

  useEffect(() => {
    updateBalance(asset.id);
  }, [asset, updateBalance]);

  return (
    <Box
      className="token-item"
      onClick={onClick}
      borderRadius="m"
      padding={[1, 2]}
    >
      <TokenIcon name={iconName ?? asset.name ?? 'empty'} />
      <Box className="token-item__box" padding={0}>
        <Box className="token-item__box-left" padding={0}>
          <Typography.Text className="token-item__box-left-symbol">
            {asset.name}
          </Typography.Text>
          <Typography.Text
            className="token-item__box-left-name"
            type="secondary"
          >
            {asset.name}
          </Typography.Text>
        </Box>
        <Typography.Text className="token-item__box-balance">
          {balance}
        </Typography.Text>
      </Box>
    </Box>
  );
};

export { TokenListItem };
