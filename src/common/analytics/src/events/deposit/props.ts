import {
  AmmPoolProps,
  LiquidityOperationBasedProps,
  OperationSettingsProps,
} from '../generalProps';

export type DepositProps = LiquidityOperationBasedProps &
  OperationSettingsProps &
  AmmPoolProps;
