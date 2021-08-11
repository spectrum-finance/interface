import {
  AmmPool,
  NetworkAmmPoolValidation,
  ValidationResult,
} from 'ergo-dex-sdk';
import explorer from '../services/explorer';

const v = new NetworkAmmPoolValidation(explorer);

export const checkPool = async (pool: AmmPool): Promise<ValidationResult> => {
  const r = await v.validate(pool);
  console.log('r ', r);
  return r;
};
