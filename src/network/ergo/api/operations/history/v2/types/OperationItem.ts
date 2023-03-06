import { AddLiquidityItem, RawAddLiquidityItem } from './AddLiquidityOperation';
import { RawSwapItem, SwapItem } from './SwapOperation';

export type RawOperationItem = RawSwapItem | RawAddLiquidityItem;

export type OperationItem = SwapItem | AddLiquidityItem;
