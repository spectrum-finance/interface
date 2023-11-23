import CountdownTimer from './CountdownTimer';
import styles from './DetailsLBE.module.less';
import FaqDetails from './FaqDetails';
import TokenCards from './TokenCards';

interface DetailsProps {
  mobile: boolean;
  startTime: number;
  endTime: number;
}

export default function DetailsLBE(props: DetailsProps) {
  const { mobile, startTime, endTime } = props;

  if (mobile) {
    return (
      <div>
        <TokenCards />
        <FaqDetails />
      </div>
    );
  } else {
    return (
      <section className={styles.boxDetailsEvent}>
        <h2 className={styles.boxTitle}>
          TeddySwap Liquidity Boostrapping Event
        </h2>
        <div className={styles.boxTimeContainer}>
          <p className={styles.titleContainer}>Remaining Time</p>
          <div className={styles.timeContent}>
            <CountdownTimer startTime={startTime} endTime={endTime} />
          </div>
        </div>
        <TokenCards />
        <FaqDetails />
      </section>
    );
  }
}
