import './TokenListModal.less';

import { AssetAmount, AssetInfo } from '@ergolabs/ergo-sdk';
import React, { useState } from 'react';

import {
  Box,
  Col,
  Input,
  Row,
  SearchOutlined,
} from '../../../../../ergodex-cdk/components';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  close: () => void;
  onSelectChanged?: (name: AssetInfo) => void | undefined;
  readonly assets?: AssetInfo[];
}

const TokenListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
  assets,
}) => {
  const [searchWords, setSearchWords] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value.toLowerCase());
  };

  const byTerm = (asset: AssetInfo) =>
    !searchWords || asset.name?.toLowerCase().includes(searchWords);

  const handleClick = (asset: AssetInfo) => {
    if (onSelectChanged) {
      onSelectChanged(asset);
    }

    if (close) {
      close();
    }
  };

  return (
    <Box className="token-list-modal" padding={0}>
      <Input
        placeholder="Search"
        size="large"
        prefix={<SearchOutlined />}
        onChange={handleSearch}
      />
      <Row className="token-list-modal__token-list">
        <Col span={24}>
          {assets?.filter(byTerm).map((asset) => (
            <TokenListItem
              key={asset.id}
              asset={asset}
              iconName={asset.name}
              onClick={() => handleClick(asset)}
            />
          ))}
        </Col>
      </Row>
    </Box>
  );
};

export { TokenListModal };
