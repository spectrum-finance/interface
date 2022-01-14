import './TokenListModal.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import React, { useState } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { Flex, Input, Modal, SearchOutlined } from '../../../../../ergodex-cdk';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  close: () => void;
  onSelectChanged?: (name: AssetInfo) => void | undefined;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assets?: AssetInfo[];
}

const TokenListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
  assets$,
}) => {
  const [searchWords, setSearchWords] = useState('');
  const [assets] = useObservable(assets$ ?? of([]));

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
    <>
      <Modal.Title>Select a token</Modal.Title>
      <Modal.Content width={400}>
        <Input
          placeholder="Search"
          size="large"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
        />
        <Flex direction="col">
          {/*<Col span={24}>*/}
          {assets?.filter(byTerm).map((asset) => (
            <TokenListItem
              key={asset.id}
              asset={asset}
              iconName={asset.name}
              onClick={() => handleClick(asset)}
            />
          ))}
          {/*</Col>*/}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { TokenListModal };
