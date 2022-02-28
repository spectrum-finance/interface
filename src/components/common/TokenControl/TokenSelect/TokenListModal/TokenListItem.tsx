import './TokenListItem.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { Box, Typography } from '../../../../../ergodex-cdk';
import { TokenIcon } from '../../../../TokenIcon/TokenIcon';

interface TokenListItemProps {
  asset: AssetInfo;
  iconName?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const TokenListItem: React.FC<TokenListItemProps> = ({ asset, onClick }) => {
  return (
    <Box
      className="token-item"
      onClick={onClick}
      borderRadius="m"
      padding={[3, 4]}
      bordered={false}
    >
      <TokenIcon size="large" asset={asset} />
      <Box className="token-item__box" padding={0} bordered={false}>
        <Box className="token-item__box-left" padding={0} bordered={false}>
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
      </Box>
    </Box>
  );
};

export { TokenListItem };
