import { useDevice } from '@ergolabs/ui-kit';

import DepositDApp from './DepositBox/DepositDApp';
import DepositManual from './DepositBox/DepositManual';
import CountdownTimer from './Details/CountdownTimer';
import DetailsLBE from './Details/DetailsLBE';
import styles from './LBE.module.less';

export default function LBE() {
  const { moreThan } = useDevice();

  const targetDate = '12/10/2023';

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
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
        </>
      )}
      <div className={styles.depositGroup}>
        <DepositDApp />
        <DepositManual />
      </div>
      {moreThan('l') ? (
        <DetailsLBE mobile={false} targetDate={targetDate} />
      ) : (
        <DetailsLBE mobile={true} targetDate={targetDate} />
      )}
      {/* <DetailsLBE /> */}
    </main>
  );
}
