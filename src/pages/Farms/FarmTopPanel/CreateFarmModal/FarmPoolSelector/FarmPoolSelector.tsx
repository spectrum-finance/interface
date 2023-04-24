import { Control } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { LabeledContent } from '../../../../../components/LabeledContent/LabeledContent';
import { PoolSelector } from '../../../../../components/PoolSelector/PoolSelector';

export interface FarmPoolSelectorProps extends Control<AmmPool | undefined> {
  readonly ammPools: AmmPool[];
  readonly ammPoolsLoading?: boolean;
}

export const FarmPoolSelector: FC<FarmPoolSelectorProps> = ({
  value,
  onChange,
  ammPools,
  ammPoolsLoading,
}) => (
  <LabeledContent
    label={t`Liquidity pool`}
    tooltipContent={t`The liquidity tokens of this pool will participate in the farming program.`}
  >
    <PoolSelector
      hasSearch
      ammPools={ammPools}
      ammPoolsLoading={ammPoolsLoading}
      value={value}
      onChange={onChange}
    />
  </LabeledContent>
);
