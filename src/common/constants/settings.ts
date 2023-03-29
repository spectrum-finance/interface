import { fractionsToNum } from '../../utils/math';
import { DEFAULT_MINER_FEE, ERG_DECIMALS, MIN_EX_FEE } from './erg';

export const defaultMinerFee = fractionsToNum(DEFAULT_MINER_FEE, ERG_DECIMALS);
export const defaultExFee = fractionsToNum(MIN_EX_FEE, ERG_DECIMALS);
export const MinerFeeMax = 5;
export const MinerFeeDecimals = 2;

export const defaultSlippage = 3;
export const MIN_SLIPPAGE = 0.01;
export const MAX_SLIPPAGE = 100;
export const SlippageDecimals = 2;

export const PoolFeeMax = 0.25;

export const UI_REWARD_ADDRESS = '';
