import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';

export const normalizeAmountWithFee = (
  amount: Currency,
  availableBalance: Currency,
  feeAsset: AssetInfo,
  fee: Currency,
): Currency =>
  amount.asset.id === feeAsset.id && fee.plus(amount).gt(availableBalance)
    ? amount.minus(fee)
    : amount;
