import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { useSelectedNetwork } from '../common/network';

export const useHandleDepositMaxButtonClick = (): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useHandleDepositMaxButtonClick();
};
