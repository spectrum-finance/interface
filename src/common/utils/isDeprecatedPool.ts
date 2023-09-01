import { applicationConfig } from '../../applicationConfig';

export const isDeprecatedPool = (poolId: string): boolean =>
  applicationConfig.deprecatedPools.includes(poolId);
