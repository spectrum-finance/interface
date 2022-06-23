import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Animation,
  Flex,
  Input,
  List,
  LoadingDataState,
  Modal,
  SearchOutlined,
  useSearch,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { AssetListItem } from './AssetListItem/AssetListItem';

interface TokenListModalProps {
  readonly close: () => void;
  readonly onSelectChanged?: (name: AssetInfo) => void | undefined;
  readonly assets$?: Observable<AssetInfo[]>;
}

const AssetListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
  assets$,
}) => {
  const [searchByTerm, setTerm] = useSearch<AssetInfo>(['name']);
  const [assets, loading] = useObservable(assets$ ?? of([]));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(e.target.value);

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
      <Modal.Content width={500}>
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
          {loading && (
            <Animation.FadeIn>
              <LoadingDataState height={150} />
            </Animation.FadeIn>
          )}
          {!loading && (
            <Animation.FadeIn>
              <List
                dataSource={searchByTerm(assets)}
                gap={1}
                maxHeight={350}
                emptyTemplate="test"
              >
                {(asset) => (
                  <AssetListItem
                    key={asset.id}
                    asset={asset}
                    onClick={() => handleClick(asset)}
                  />
                )}
              </List>
            </Animation.FadeIn>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { AssetListModal };
