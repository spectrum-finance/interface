import { Button, PlusOutlined } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { AmmPool } from '../../../../../common/models/AmmPool.ts';
import { TableView } from '../../../../../components/TableView/TableView';
import { AprColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/AprColumn/AprColumn.tsx';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { Apr24InfoTooltip } from '../../../common/components/Apr24InfoTooltip/Apr24InfoTooltip.tsx';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { PoolsOrPositionsTableViewProps } from '../../../common/types/PoolsOrPositionsTableViewProps';

export const PoolsOrPositionsTableView: FC<
  PoolsOrPositionsTableViewProps<any> & { expandHeight: number }
> = ({ children, poolMapper, items }) => {
  const navigate = useNavigate();
  return (
    <TableView
      items={items}
      itemKey="id"
      itemHeight={68}
      maxHeight="calc(100vh - 338px)"
      gap={1}
      tableItemViewPadding={2}
      tableHeaderPadding={[0, 4]}
      onItemClick={(item) => {
        if (item.id) {
          navigate(item.id);
        } else if (item.pool.id) {
          navigate(item.pool.id);
        } else if (item.pool.pool.id) {
          navigate(item.pool.pool.id);
        }
      }}
    >
      <TableView.Column flex={1} width={'90%'} title={<Trans>Pair</Trans>}>
        {(ammPool) => <PairColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column
        width="120px"
        title={
          <Apr24InfoTooltip>
            <Trans>APR 24h</Trans>
          </Apr24InfoTooltip>
        }
      >
        {(ammPool: AmmPool) => (
          <AprColumn isAllContentTrigger ammPool={poolMapper(ammPool)} />
        )}
      </TableView.Column>
      {children}
      <TableView.Column width="32px">
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
      <TableView.State name="search" condition={!items.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
