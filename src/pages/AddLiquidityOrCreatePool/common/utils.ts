import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';

export const normalizeAmountWithFee = (
  amount: Currency,
  availableBalance: Currency,
  networkAsset: AssetInfo,
  fee: Currency,
): Currency =>
  amount.asset.id === networkAsset.id && fee.plus(amount).gt(availableBalance)
    ? amount.minus(fee)
    : amount;
