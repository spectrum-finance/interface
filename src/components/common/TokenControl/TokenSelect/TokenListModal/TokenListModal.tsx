import './TokenListModal.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import { t, Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../common/hooks/useObservable';
import {
  Flex,
  Input,
  List,
  Modal,
  SearchOutlined,
} from '../../../../../ergodex-cdk';
import { useDevice } from '../../../../../hooks/useDevice';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  close: () => void;
  onSelectChanged?: (name: AssetInfo) => void | undefined;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assets?: AssetInfo[];
}

export const TokenListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
  assets$,
}) => {
  const { valBySize } = useDevice();
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
      <Modal.Title>
        <Trans>Select a token</Trans>
      </Modal.Title>
      <Modal.Content width={valBySize('100%', '500px')}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Input
              autoFocus
              placeholder={t`Search`}
              size="large"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
            />
          </Flex.Item>
          <List dataSource={assets?.filter(byTerm)} gap={0} maxHeight={350}>
            {(asset) => (
              <TokenListItem
                key={asset.id}
                asset={asset}
                iconName={asset.name}
                onClick={() => handleClick(asset)}
              />
            )}
          </List>
        </Flex>
      </Modal.Content>
    </>
  );
};
