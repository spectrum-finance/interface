import { DEFAULT_MINER_FEE, ERG_DECIMALS, MIN_EX_FEE } from './erg';
import { fractionsToNum } from '../utils/math';

export const MinerFeeDefault = fractionsToNum(DEFAULT_MINER_FEE, ERG_DECIMALS);
export const DexFeeDefault = fractionsToNum(MIN_EX_FEE, ERG_DECIMALS);
export const MinerFeeMin = MinerFeeDefault;
export const MinerFeeMax = 5;
export const MinerFeeDecimals = 2;

export const SlippageDefault = 0.1;
export const SlippageMin = 0.1;
export const SlippageMax = 100;
export const SlippageDecimals = 2;

export const PoolFeeMin = 0;
export const PoolFeeMax = 0.25;
export const PoolFeeDecimals = 3;

export const UiRewardAddress =
  '9gCigPc9cZNRhKgbgdmTkVxo1ZKgw79G8DvLjCcYWAvEF3XRUKy';
