import { t } from '@lingui/macro';

import { Currency } from '../../../../common/models/Currency';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { CreateFarmModel } from '../CreateFarmModel';

// const insufficientFeeValidator: OperationValidator<AddLiquidityFormModel> = ({
//   value: { x, y },
// }) => {
//   let totalFeesWithAmount = x?.isAssetEquals(networkAsset)
//     ? x?.plus(totalFees)
//     : totalFees;
//
//   totalFeesWithAmount = y?.isAssetEquals(networkAsset)
//     ? totalFeesWithAmount.plus(y)
//     : totalFees;
//
//   return totalFeesWithAmount.gt(balance.get(networkAsset))
//     ? t`Insufficient ${networkAsset.ticker} Balance for Fees`
//     : undefined;
// };
//
// const balanceValidator: OperationValidator<AddLiquidityFormModel> = ({
//   value: { x, y },
// }) => {
//   if (x?.gt(balance.get(x?.asset))) {
//     return t`Insufficient ${x?.asset.ticker} Balance`;
//   }
//
//   if (y?.gt(balance.get(y?.asset))) {
//     return t`Insufficient ${y?.asset.ticker} Balance`;
//   }
//
//   return undefined;
// };

// const amountValidator: OperationValidator<CreateFarmModel> = ({
//   value: { x, y },
// }) => {
//   if (
//     (!x?.isPositive() && y?.isPositive()) ||
//     (!y?.isPositive() && x?.isPositive())
//   ) {
//     return undefined;
//   }
//
//   return (!x?.isPositive() || !y?.isPositive()) && t`Enter an Amount`;
// };

// const minValueValidator: OperationValidator<CreateFarmModel> = ({
//   value: { xAsset, yAsset, x, y, pool },
// }) => {
//   let c: Currency | undefined;
//   if (!x?.isPositive() && y?.isPositive() && pool) {
//     c = pool.calculateDepositAmount(new Currency(1n, xAsset)).plus(1n);
//   }
//   if (!y?.isPositive() && x?.isPositive() && pool) {
//     c = pool.calculateDepositAmount(new Currency(1n, yAsset));
//   }
//   return c && t`Min value for ${c?.asset.ticker} is ${c?.toString()}`;
// };

const selectTokenValidator: OperationValidator<CreateFarmModel> = ({
  value: { distributionInterval },
}) => !distributionInterval && t`Enter a distribution interval`;

const selectPoolValidator: OperationValidator<CreateFarmModel> = ({
  value: { pool },
}) => !pool && t`Select pool`;

const selectPeriodValidator: OperationValidator<CreateFarmModel> = ({
  value: { period },
}) => !period && t`Select period`;

export const validators: OperationValidator<CreateFarmModel>[] = [
  selectPoolValidator,
  selectPeriodValidator,
  // amountValidator,
  // minValueValidator,
  // balanceValidator,
  // insufficientFeeValidator,
];
