import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Flex,
  Input,
  LoadingDataState,
  Modal,
  SearchDataState,
  SearchOutlined,
  useSearch,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { List } from '../../../../List/List';
import { ListStateView } from '../../../../List/ListStateView/ListStateView';
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

  const items = searchByTerm(assets);

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
          <List
            itemKey="id"
            items={items}
            gap={1}
            maxHeight={350}
            itemHeight={52}
          >
            {({ item, height }) => (
              <AssetListItem
                height={height}
                asset={item}
                onClick={() => handleClick(item)}
              />
            )}
            <ListStateView name="loading" condition={loading}>
              <LoadingDataState height={150}>
                <Trans>Loading assets</Trans>
              </LoadingDataState>
            </ListStateView>
            <ListStateView name="empty" condition={!items.length}>
              <SearchDataState height={150}>
                <Trans>No results was found</Trans>
              </SearchDataState>
            </ListStateView>
          </List>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { AssetListModal };
