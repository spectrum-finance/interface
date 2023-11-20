import CountdownTimer from './CountdownTimer';
import styles from './DetailsLBE.module.less';
import FaqDetails from './FaqDetails';
import TokenCards from './TokenCards';

interface DetailsProps {
  mobile: boolean;
  targetDate: string;
}

export default function DetailsLBE(props: DetailsProps) {
  const { mobile, targetDate } = props;

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
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
        <TokenCards />
        <FaqDetails />
      </section>
    );
  }
}
