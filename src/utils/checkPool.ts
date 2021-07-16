import { AmmPool, NetworkAmmPoolValidation } from 'ergo-dex-sdk';
import { explorer } from './explorer';

export const checkPool = async (pool: AmmPool) => {
  return new NetworkAmmPoolValidation(explorer).validate(pool);
};
