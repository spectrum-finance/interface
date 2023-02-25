import { Currency } from '../../common/models/Currency';
import { useSelectedNetwork } from '../common/network';

export const useHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const [selectedNetwork] = useSelectedNetwork();

  return selectedNetwork.useHandleSwapMaxButtonClick();
};
