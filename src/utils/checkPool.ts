import explorer from '../services/explorer';
import {
  AmmPool,
  DefaultAmmPoolValidation,
  ValidationResult,
} from '@ergolabs/ergo-dex-sdk';

const poolValidation = new DefaultAmmPoolValidation(explorer);

export const checkPool = async (pool: AmmPool): Promise<ValidationResult> => {
  return poolValidation.validate(pool);
};
