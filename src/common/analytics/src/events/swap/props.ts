import { AmmPoolProps, OperationSettingsProps } from '../generalProps';

export type SwapProps = {
  from_name: string;
  from_amount: number;
  from_usd: number;
  from_id: string;
  to_name: string;
  to_amount: number;
  to_usd: number;
  to_id: string;
} & OperationSettingsProps &
  AmmPoolProps;
