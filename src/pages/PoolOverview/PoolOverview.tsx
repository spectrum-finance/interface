import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { Skeleton } from '@ergolabs/ui-kit';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../common/hooks/useObservable';
import { useParamsStrict } from '../../common/hooks/useParamsStrict';
import { getPositionByAmmPoolId } from '../../gateway/api/positions';
import { useGuard } from '../../hooks/useGuard';
import { X } from '../../utils/images';
import { getAmmPoolConfidenceAnalyticByAmmPoolId } from './AmmPoolConfidenceAnalytic';
import { PoolInfoView } from './PoolInfoView/PoolInfoView';
import styles from './PoolOverview.module.less';

export const PoolOverview: React.FC = () => {
  const navigate = useNavigate();
  const { poolId } = useParamsStrict<{ poolId: PoolId }>();
  const [position, loading] = useObservable(getPositionByAmmPoolId(poolId), []);
  const [poolConfidenceAnalytic] = useObservable(
    getAmmPoolConfidenceAnalyticByAmmPoolId(poolId),
    [],
  );

  useGuard(position, loading, () => navigate('../../../liquidity'));
  const handleClickBack = () => {
    navigate('../../../liquidity');
  };
  return (
    <main className={styles.poolOverviewContainer}>
      <section className={styles.header}>
        <h2 className={styles.title}>Pool overview</h2>
        <svg
          width="24"
          height="24"
          className={styles.icon}
          onClick={handleClickBack}
        >
          <use href={X} />
        </svg>
      </section>
      <section className={styles.body}>
        {position && poolConfidenceAnalytic ? (
          <PoolInfoView position={position} />
        ) : (
          <Skeleton active />
        )}
      </section>
    </main>
  );
};
