import { Button, PlusOutlined } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { PoolsOrPositionsTableViewProps } from '../../../common/types/PoolsOrPositionsTableViewProps';

export const PoolsOrPositionsTableView: FC<
  PoolsOrPositionsTableViewProps<any> & { expandHeight: number }
> = ({ children, poolMapper, items, expandComponent, expandHeight }) => {
  const navigate = useNavigate();
  return (
    <TableView
      items={items}
      itemKey="id"
      itemHeight={68}
      maxHeight="calc(100vh - 338px)"
      gap={1}
      showHeader={false}
      tableItemViewPadding={2}
      expand={{
        height: expandHeight,
        accordion: true,
        component: expandComponent,
      }}
    >
      <TableView.Column flex={1} width="82%" title={<Trans>Pair</Trans>}>
        {(ammPool) => <PairColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column width="10%">
        {(ammPool) => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              if (ammPool.id) {
                navigate(`${ammPool.id}/add`);
              } else if (ammPool.pool.id) {
                navigate(`${ammPool.pool.id}/add`);
              } else if (ammPool.pool.pool.id) {
                navigate(`${ammPool.pool.pool.id}/add`);
              }
            }}
          />
        )}
      </TableView.Column>
      {children}
      <TableView.State name="search" condition={!items.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
