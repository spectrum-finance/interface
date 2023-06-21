import { Button, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { Position } from '../../../../../common/models/Position';
import { InfoTooltip } from '../../../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';
import { TableView } from '../../../../../components/TableView/TableView';
import { AprColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/AprColumn/AprColumn';
import { PairColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/PairColumn/PairColumn';
import { TvlOrVolume24Column } from '../../../common/columns/PoolsOrPositionsColumns/columns/TvlOrVolume24Column/TvlOrVolume24Column';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';

export interface PoolsOrPositionsTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly poolMapper: (item: T) => AmmPool;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
}

export const PoolsOrPositionsTableView: FC<
  PropsWithChildren<PoolsOrPositionsTableViewProps<any>>
> = ({ children, poolMapper, items }) => {
  const { valBySize, m } = useDevice();
  const navigate = useNavigate();

  return (
    <TableView
      items={items}
      onItemClick={(item) => {
        if (item.id) {
          navigate(item.id);
        } else {
          navigate(item.pool.pool.id);
        }
      }}
      itemKey="id"
      itemHeight={80}
      maxHeight={376}
      gap={1}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4]}
    >
      <TableView.Column
        width={311}
        headerWidth={303}
        title={<Trans>Pair</Trans>}
      >
        {(ammPool) => <PairColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 158)}
        title={<Trans>TVL</Trans>}
      >
        {(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).tvl} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 200)}
        title={<Trans>Volume 24h</Trans>}
      >
        {(ammPool) => <TvlOrVolume24Column usd={poolMapper(ammPool).volume} />}
      </TableView.Column>
      <TableView.Column
        width={valBySize(128, 128, 158)}
        title={
          <InfoTooltip
            width={300}
            placement="top"
            content={
              <>
                <Trans>
                  Annual Percentage Rate. Average estimation of how much you may
                  potentially earn providing liquidity to this pool.
                </Trans>
                <br />
                <Typography.Link
                  target="_blank"
                  href="https://docs.spectrum.fi/docs/protocol-overview/analytics#apr"
                >
                  <Trans>Read more</Trans>
                </Typography.Link>
              </>
            }
          >
            <Trans>APR</Trans>
          </InfoTooltip>
        }
      >
        {(ammPool: AmmPool) => <AprColumn ammPool={poolMapper(ammPool)} />}
      </TableView.Column>
      <TableView.Column width={valBySize(20, 20, 140)}>
        {(ammPool) => (
          <Button
            type="primary"
            onClick={(event) => {
              if (ammPool.id) {
                navigate(`${ammPool.id}/add`);
              } else {
                navigate(`${ammPool.pool.pool.id}/add`);
              }
              event.stopPropagation();
            }}
          >
            {m ? '' : <Trans>Add Liquidity</Trans>}
          </Button>
        )}
      </TableView.Column>
      {children}
      <TableView.State name="search" condition={!items.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
