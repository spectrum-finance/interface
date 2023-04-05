import { Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../common/models/Position';
import { AssetTitle } from '../../../../components/AssetTitle/AssetTitle';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InlineGrid } from '../../../../components/InlineGrid/InlineGrid';
import { TitledBox } from '../../../../components/TitledBox/TitledBox';

export interface TotalLiquidityProps {
  readonly position: Position;
}

export const TotalLiquidity: FC<TotalLiquidityProps> = ({ position }) => {
  return (
    <TitledBox
      secondary
      glass
      borderRadius="l"
      title={
        <Typography.Body strong>
          <Trans>Total liquidity</Trans>
        </Typography.Body>
      }
      titleGap={1}
      subtitle={
        <Typography.Title level={3}>
          <ConvenientAssetView value={[position.pool.x, position.pool.y]} />
        </Typography.Title>
      }
      subtitleGap={2}
      padding={3}
    >
      <InlineGrid gap={2}>
        <InlineGrid.Item
          title={<AssetTitle asset={position.pool.x.asset} gap={1} level={5} />}
          value={
            <Typography.Body size="large" strong>
              {position.pool.x.toString()}
            </Typography.Body>
          }
        />
        <InlineGrid.Item
          title={<AssetTitle asset={position.pool.y.asset} gap={1} level={5} />}
          value={
            <Typography.Body size="large" strong>
              {position.pool.y.toString()}
            </Typography.Body>
          }
        />
      </InlineGrid>
    </TitledBox>
  );
};
