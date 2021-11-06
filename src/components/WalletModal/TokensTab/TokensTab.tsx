import { AssetAmount } from '@ergolabs/ergo-sdk';
import React, { useEffect, useState } from 'react';

import { Box, Col, Row, Typography } from '../../../ergodex-cdk';
import { listWalletAssets } from '../../../services/userWallet';
import { renderFractions } from '../../../utils/math';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

interface TokenListItemProps {
  name?: string;
  balance?: number;
}

const TokenListItem: React.FC<TokenListItemProps> = ({ name, balance }) => (
  <Box
    padding={[2, 4, 1, 4]}
    borderRadius="m"
    className="token__list-item_wrapper"
  >
    <Row align="middle">
      <Col span={2}>
        <TokenIcon name={name ?? 'empty'} />
      </Col>
      <Col span={18} style={{ paddingLeft: 10 }}>
        <Row>
          <Typography.Text strong style={{ fontSize: '16px' }}>
            {name}
          </Typography.Text>
        </Row>
        <Row align="bottom">
          <Typography.Text style={{ fontSize: '10px' }} className="token-name">
            {name}
          </Typography.Text>
        </Row>
      </Col>
      <Col span={4}>
        <Typography.Text strong style={{ fontSize: '16px', float: 'right' }}>
          {balance}
        </Typography.Text>
      </Col>
    </Row>
  </Box>
);

const TokensTab: React.FC = () => {
  const [availableWalletAssets, setAvailableWalletAssets] = useState<
    AssetAmount[] | undefined
  >();

  useEffect(() => {
    listWalletAssets().then(setAvailableWalletAssets);
  }, []);

  return (
    <Row topGutter={1}>
      {availableWalletAssets &&
        availableWalletAssets.map((token, key) => (
          <Col span={24} key={key}>
            <TokenListItem
              name={token.asset.name}
              balance={Number(
                renderFractions(token.amount, token.asset.decimals),
              )}
            />
          </Col>
        ))}
    </Row>
  );
};

export { TokensTab };
