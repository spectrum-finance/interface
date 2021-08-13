import {
  AmmPool,
  NetworkAmmPoolValidation,
  ValidationResult,
} from 'ergo-dex-sdk';
import explorer from '../services/explorer';

const poolValidation = new NetworkAmmPoolValidation(explorer);

export const checkPool = async (pool: AmmPool): Promise<ValidationResult> => {
  return poolValidation.validate(pool);
};
