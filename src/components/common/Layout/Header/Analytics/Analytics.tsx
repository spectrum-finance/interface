import { useObservable } from '../../../../../common/hooks/useObservable';
import { platformStats$ } from '../../../../../gateway/api/platformStats';
import { formatToAda, formatToUSD } from '../../../../../services/number';
import { IsCardano } from '../../../../IsCardano/IsCardano';
import { IsErgo } from '../../../../IsErgo/IsErgo';
import styles from './Analytics.module.less';
import { AnalyticsSkeletonLoader } from './AnalyticsSkeletonLoader/AnalyticsSkeletonLoader.tsx';

export default function Analytics() {
  const [currentStats] = useObservable(platformStats$, []);
  return (
    <div className={styles.analyticsSection}>
      <div className={styles.tag}>
        <p className={styles.tagName}>TVL:</p>
        <p className={styles.tagValue}>
          {currentStats?.tvl !== undefined ? (
            <>
              <IsErgo>
                {formatToUSD(currentStats.tvl.toAmount(), 'abbr')}
              </IsErgo>
              <IsCardano>
                {formatToAda(currentStats.tvl.toAmount(), 'abbr')}
              </IsCardano>
            </>
          ) : (
            <AnalyticsSkeletonLoader />
          )}
        </p>
      </div>
      <div className={styles.tag}>
        <p className={styles.tagName}>Volume 24H:</p>
        <p className={styles.tagValue}>
          {currentStats?.volume !== undefined ? (
            <>
              <IsErgo>
                {formatToUSD(currentStats.volume.toAmount(), 'abbr')}
              </IsErgo>
              <IsCardano>
                {formatToAda(currentStats.volume.toAmount(), 'abbr')}
              </IsCardano>
            </>
          ) : (
            <AnalyticsSkeletonLoader />
          )}
        </p>
      </div>
    </div>
  );
}
