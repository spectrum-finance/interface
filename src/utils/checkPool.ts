import {
  AmmPool,
  DefaultAmmPoolValidation,
  ValidationResult,
} from 'ergo-dex-sdk';
import explorer from '../services/explorer';

const poolValidation = new DefaultAmmPoolValidation(explorer);

export const checkPool = async (pool: AmmPool): Promise<ValidationResult> => {
  return poolValidation.validate(pool);
};
