import { defaultMinerFee, NanoErgInErg } from './erg';

// IDK what these should be...
export const MinerFeeDefault = defaultMinerFee / NanoErgInErg;
export const MinerFeeMin = MinerFeeDefault;
export const MinerFeeMax = 5;
export const MinerFeeDecimals = 2;

export const SlippageDefault = 0.1;
export const SlippageMin = 0.1;
export const SlippageMax = 100;
export const SlippageDecimals = 2;
