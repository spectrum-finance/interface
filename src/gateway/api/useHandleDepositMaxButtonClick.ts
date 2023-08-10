import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { AddLiquidityFormModel } from '../../components/AddLiquidityForm/AddLiquidityFormModel';
import { useSelectedNetwork } from '../common/network';

export const useHandleDepositMaxButtonClick = (): ((
  pct: number,
  value: AddLiquidityFormModel,
  balance: Balance,
) => [Currency, Currency]) => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useHandleDepositMaxButtonClick();
};
