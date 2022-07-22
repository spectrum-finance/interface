import {
  Flex,
  Input,
  LoadingDataState,
  SearchDataState,
  SearchOutlined,
  useSearch,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { AssetInfo } from '../../../../../../common/models/AssetInfo';
import { List } from '../../../../../List/List';
import { ListStateView } from '../../../../../List/ListStateView/ListStateView';
import { AssetListExtendedSearchItem } from './AssetListExtendedSearchItem/AssetListExtendedSearchItem';
import { AssetListExtendedSearchTitle } from './AssetListExtendedSearchTitle/AssetListExtendedSearchTitle';
import { AssetListItem } from './AssetListItem/AssetListItem';

export interface AssetListSelectTokenStateProps {
  readonly value?: AssetInfo;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly onAssetSelect: (ai: AssetInfo) => void;
  readonly onAssetImport: (ai: AssetInfo) => void;
}

export const AssetListSelectTokenState: FC<AssetListSelectTokenStateProps> = ({
  assetsToImport$,
  assets$,
  onAssetSelect,
  onAssetImport,
  value,
}) => {
  const [searchByTerm, setTerm, term] = useSearch<AssetInfo>([
    'ticker',
    'name',
  ]);
  const [assets, loading] = useObservable(assets$ ?? of([]));
  const [tokenAssetsToImport] = useObservable(assetsToImport$ ?? of([]));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(e.target.value);

  const items =
    !term ||
    !tokenAssetsToImport?.length ||
    (!!term && !searchByTerm(tokenAssetsToImport)?.length)
      ? searchByTerm(assets)
      : {
          default: { items: searchByTerm(assets) },
          toImport: {
            items: searchByTerm(tokenAssetsToImport),
            height: 38,
            title: <AssetListExtendedSearchTitle />,
          },
        };

  return (
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
        fadeInDelay={50}
        gap={1}
        maxHeight={350}
        itemHeight={52}
      >
        {({ item, height, group }) =>
          group === 'toImport' ? (
            <AssetListExtendedSearchItem
              height={height}
              asset={item}
              onClick={() => onAssetImport(item)}
            />
          ) : (
            <AssetListItem
              height={height}
              active={value?.id === item.id}
              asset={item}
              onClick={() => onAssetSelect(item)}
            />
          )
        }
        <ListStateView name="loading" condition={loading}>
          <LoadingDataState height={150}>
            <Trans>Loading assets</Trans>
          </LoadingDataState>
        </ListStateView>
        <ListStateView
          name="empty"
          condition={
            items instanceof Array
              ? !items.length
              : !items.default.items.length && !items.toImport.items.length
          }
        >
          <SearchDataState height={150}>
            <Trans>No results was found</Trans>
          </SearchDataState>
        </ListStateView>
      </List>
    </Flex>
  );
};
