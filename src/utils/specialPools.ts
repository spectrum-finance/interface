import { applicationConfig } from '../applicationConfig.ts';

export const isSpecialBoostedPool = (poolId: string) => {
  return applicationConfig.specialRewards.some((id) => id === poolId);
};
