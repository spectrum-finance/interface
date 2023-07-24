import {
  AddLiquidityItem,
  RemoveLiquidityItem,
  SwapItem,
} from '../../../../../common/models/OperationV2';
import { RawAddLiquidityItem } from './AddLiquidityOperation';
import { RawRemoveLiquidityItem } from './RemoveLiquidityOperation';
import { RawSwapItem } from './SwapOperation';

export type RawOperationItem =
  | RawSwapItem
  | RawAddLiquidityItem
  | RawRemoveLiquidityItem;

export type OperationItem = SwapItem | AddLiquidityItem | RemoveLiquidityItem;
