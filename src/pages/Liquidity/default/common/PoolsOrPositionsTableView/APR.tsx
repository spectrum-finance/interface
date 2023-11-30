import { FC, useEffect, useState } from 'react';
import { firstValueFrom, Observable } from 'rxjs';

export const APR: FC<{
  infoPool: any;
  isLoading: boolean;
  calculateAPR: (
    poolId: string,
    userLPAmount?: bigint | undefined,
  ) => Observable<bigint>;
}> = ({ infoPool, calculateAPR, isLoading }) => {
  const [apr, setApr] = useState<bigint | null>(null);

  useEffect(() => {
    const yieldFarmingAprByPoolId = async (pool: any) => {
      if (pool === undefined || pool.poolAnalytics === undefined) return;
      try {
        const aprValue = await firstValueFrom(
          calculateAPR(pool.poolAnalytics.id),
        );
        setApr(aprValue);
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setTimeout(() => {
      if (infoPool) {
        yieldFarmingAprByPoolId(infoPool);
      }
    }, 20_000);

    yieldFarmingAprByPoolId(infoPool);

    return () => clearInterval(interval);
  }, [isLoading]);

  const finalAPR = infoPool.yearlyFeesPercent + (Number(apr?.toString()) || 0);
  return <>{finalAPR >= 0 ? `${finalAPR}%` : '-'}</>;
};
