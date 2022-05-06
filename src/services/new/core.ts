import { ERG_DECIMALS } from '../../common/constants/erg';
import { Currency } from '../../common/models/Currency';
import { normalizeAmount } from '../../common/utils/amount';
import { useSettings } from '../../context';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { calculateTotalFee } from '../../utils/transactions';

export const useMinExFee = (): Currency => {
  const [{ minerFee }] = useSettings();
  const [networkAsset] = useNetworkAsset();

  const exFee = +normalizeAmount((minerFee * 3).toString(), networkAsset);

  return new Currency(calculateTotalFee([exFee], ERG_DECIMALS), networkAsset);
};

export const useMaxExFee = (): Currency => {
  const [{ minerFee, nitro }] = useSettings();
  const [networkAsset] = useNetworkAsset();

  const exFee = +normalizeAmount(
    (minerFee * 3 * nitro).toString(),
    networkAsset,
  );

  return new Currency(calculateTotalFee([exFee], ERG_DECIMALS), networkAsset);
};

export const useMaxTotalFees = (): Currency => {
  const [{ minerFee, nitro }] = useSettings();
  const [networkAsset] = useNetworkAsset();

  const exFee = +normalizeAmount(
    (minerFee * 3 * nitro).toString(),
    networkAsset,
  );

  return new Currency(
    calculateTotalFee([minerFee, exFee], ERG_DECIMALS),
    networkAsset,
  );
};

export const useMinTotalFees = (): Currency => {
  const [{ minerFee }] = useSettings();
  const [networkAsset] = useNetworkAsset();

  const exFee = +normalizeAmount((minerFee * 3).toString(), networkAsset);

  return new Currency(
    calculateTotalFee([minerFee, exFee], ERG_DECIMALS),
    networkAsset,
  );
};
