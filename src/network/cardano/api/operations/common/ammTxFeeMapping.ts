import { AmmTxFeeMapping } from '@spectrumlabs/cardano-dex-sdk';

export const ammTxFeeMapping: AmmTxFeeMapping = {
  swapOrder: 500000n,
  depositOrder: 500000n,
  redeemOrder: 500000n,
  swapExecution: 500000n,
  depositExecution: 500000n,
  redeemExecution: 500000n,
  poolCreation: 2000000n,
  lockOrder: 500000n,
};
