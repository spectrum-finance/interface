import { Box, Flex, Progress, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm } from '../../../../../common/models/Farm';
import { ConvenientAssetView } from '../../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../../components/InfoTooltip/InfoTooltip';
import { UsdCell } from '../common/UsdCell/UsdCell';

export interface TotalStakedCellProps {
  readonly farm: Farm;
}

export const TotalStakedCell: FC<TotalStakedCellProps> = ({ farm }) => (
  <UsdCell
    y={farm.totalStakedY}
    x={farm.totalStakedX}
    label={<Trans>Total staked</Trans>}
  />
);
