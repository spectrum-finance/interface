import {
  Flex,
  Input,
  LoadingDataState,
  SearchDataState,
  SearchOutlined,
  useSearch,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import * as React from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { AssetInfo } from '../../../../../../common/models/AssetInfo';
import { Dictionary } from '../../../../../../common/utils/Dictionary';
import { useAssetsBalance } from '../../../../../../gateway/api/assetBalance.ts';
import { EmptyGroupConfig, GroupConfig, List } from '../../../../../List/List';
import { ListStateView } from '../../../../../List/ListStateView/ListStateView';
import { AssetListExtendedSearchItem } from './AssetListExtendedSearchItem/AssetListExtendedSearchItem';
import { AssetListGroupTitle } from './AssetListGroupTitle/AssetListGroupTitle';
import { AssetListItem } from './AssetListItem/AssetListItem';

export interface AssetListSelectTokenStateProps {
  readonly value?: AssetInfo;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly onAssetSelect: (ai: AssetInfo) => void;
  readonly onAssetImport: (ai: AssetInfo) => void;
}

export const AssetListSelectTokenState: FC<AssetListSelectTokenStateProps> = ({
  assetsToImport$,
  assets$,
  importedAssets$,
  onAssetSelect,
  onAssetImport,
  value,
}) => {
  const [searchByTerm, setTerm, term] = useSearch<AssetInfo>([
    'ticker',
    'name',
  ]);
  const [assets, loading] = useObservable(assets$ ?? of([]));
  const [assetsToImport] = useObservable(assetsToImport$ ?? of([]));
  const [importedAssets] = useObservable(importedAssets$ ?? of([]));
  const [balance] = useAssetsBalance();

  const sortedAssets = assets?.sort((a, b) =>
    Number(balance.get(b).amount - balance.get(a).amount),
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTerm(e.target.value);

  const filteredAssets = searchByTerm(sortedAssets);
  const filteredImportedAssets = searchByTerm(importedAssets);
  const filteredAssetsToImport = searchByTerm(assetsToImport);

  let items: Dictionary<GroupConfig<AssetInfo> | EmptyGroupConfig<AssetInfo>> =
    { default: { items: filteredAssets } };

  if (!!filteredImportedAssets.length) {
    items = {
      ...items,
      importedAssets: {
        items: filteredImportedAssets,
        height: 38,
        title: (
          <AssetListGroupTitle>
            <Trans>Imported tokens</Trans>
          </AssetListGroupTitle>
        ),
      },
    };
  }

  if (!!term && !!filteredAssetsToImport.length) {
    items = {
      ...items,
      toImport: {
        items: filteredAssetsToImport,
        height: 38,
        title: (
          <AssetListGroupTitle>
            <Trans>Extended results from Explorer</Trans>
          </AssetListGroupTitle>
        ),
      },
    };
  }

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
        maxHeight={332}
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
              : !items.default.items?.length &&
                !items.toImport?.items.length &&
                !items.importedAssets?.items.length
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
