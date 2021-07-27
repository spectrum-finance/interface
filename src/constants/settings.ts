import { DEFAULT_MINER_FEE, ERG_DECIMALS } from './erg';
import { inputToRender } from '../utils/walletMath';

// IDK what these should be...
export const MinerFeeDefault = Number(
  inputToRender(DEFAULT_MINER_FEE, ERG_DECIMALS),
);
export const MinerFeeMin = MinerFeeDefault;
export const MinerFeeMax = 5;
export const MinerFeeDecimals = 2;

export const SlippageDefault = 0.1;
export const SlippageMin = 0.1;
export const SlippageMax = 100;
export const SlippageDecimals = 2;
