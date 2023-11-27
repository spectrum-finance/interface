import { useDevice } from '@ergolabs/ui-kit';

import DepositDApp from './DepositBox/DepositDApp';
import DepositManual from './DepositBox/DepositManual';
import CountdownTimer from './Details/CountdownTimer';
import DetailsLBE from './Details/DetailsLBE';
import styles from './LBE.module.less';

export default function LBE() {
  const { moreThan } = useDevice();

  const startTime = 1700748000 - 600;
  const endTime = startTime + 10800 + 600;

  return (
    <main className={styles.lbeContainer}>
      {!moreThan('l') && (
        <>
          <h2 className={styles.titleContainer}>
            TeddySwap Liquidity Boostrapping Event
          </h2>
          <div className={styles.boxTimeContainer}>
            <p className={styles.titleContainer}>Remaining Time</p>
            <div className={styles.timeContent}>
              <CountdownTimer startTime={startTime} endTime={endTime} />
            </div>
          </div>
        </>
      )}
      <div className={styles.depositGroup}>
        <DepositDApp startTime={startTime} endTime={endTime} />
        <DepositManual startTime={startTime} endTime={endTime} />
      </div>
      {moreThan('l') ? (
        <DetailsLBE mobile={false} startTime={startTime} endTime={endTime} />
      ) : (
        <DetailsLBE mobile={true} startTime={startTime} endTime={endTime} />
      )}
    </main>
  );
}
