import { Box, Flex, LoadingDataState, SearchDataState } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../common/models/AmmPool';
import { List } from '../../List/List';
import { ListStateView } from '../../List/ListStateView/ListStateView';
import { SearchInput } from '../../SearchInput/SearchInput';
import { PoolSelectorOverlayItemView } from './PoolSelectorOverlayItemView/PoolSelectorOverlayItemView';

export interface PoolSelectorOverlayProps {
  readonly ammPools: AmmPool[];
  readonly ammPoolsLoading?: boolean;
  readonly className?: string;
  readonly value?: AmmPool;
  readonly onChange?: (ammPool: AmmPool) => void;
  readonly hasSearch?: boolean;
}

const _PoolSelectorOverlay: FC<PoolSelectorOverlayProps> = ({
  ammPools,
  value,
  className,
  onChange,
  hasSearch,
  ammPoolsLoading,
}) => (
  <Box
    borderRadius="m"
    padding={ammPoolsLoading ? 2 : [1, 0, 1, 0]}
    className={className}
  >
    <Flex col>
      {hasSearch && !ammPoolsLoading && (
        <Flex.Item marginBottom={2}>
          <Box transparent bordered={false} padding={[2, 2, 0, 2]}>
            <SearchInput placeholder={t`Search pool`} />
          </Box>
        </Flex.Item>
      )}

      <List items={ammPools} maxHeight={250} itemHeight={32} itemKey="id">
        {({ item }) => (
          <PoolSelectorOverlayItemView
            onChange={onChange}
            active={value?.id === item.id}
            ammPool={item}
          />
        )}
        <ListStateView name="loading" condition={!!ammPoolsLoading}>
          <LoadingDataState height={150}>
            <Trans>Loading Pools</Trans>
          </LoadingDataState>
        </ListStateView>
        <ListStateView name="empty" condition={!ammPools.length}>
          <SearchDataState height={150}>
            <Trans>No results was found</Trans>
          </SearchDataState>
        </ListStateView>
      </List>
    </Flex>
  </Box>
);

export const PoolSelectorOverlay = styled(_PoolSelectorOverlay)`
  overflow: hidden;
  width: 100%;
`;
