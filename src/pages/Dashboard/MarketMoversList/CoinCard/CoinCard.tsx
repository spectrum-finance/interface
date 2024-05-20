import { ARROW_RIGHT } from '../../../../utils/images';
import styles from './CoinCard.module.less';

type CoinCardProps = {
  base: {
    name: string;
    amount: string;
  };
  quote: {
    name: string;
    amount: string;
  };
  operation: string;
  address: string;
  date: string;
};

export const CoinCard = (props: CoinCardProps) => {
  const { base, quote, operation, address, date } = props;
  return (
    <div className={styles.coinCard}>
      <div className={styles.title}>
        <h2
          className={`${styles.operation} ${
            operation === 'BUY' ? styles.buy : styles.sell
          }`}
        >
          {operation}
        </h2>
        <p className={styles.date}>{date}</p>
      </div>

      <div className={styles.coinInfo}>
        <div className={styles.tokenGroup}>
          <img src={`/img/tokens/${base.name}.png`} className={styles.logo} />
          <p className={styles.amount}>{base.amount}</p>
        </div>
        <svg width="20" height="20" className={styles.icon}>
          <use href={ARROW_RIGHT} />
        </svg>
        <div className={styles.tokenGroup}>
          <img src={`/img/tokens/${quote.name}.png`} className={styles.logo} />
          <p className={styles.amount}>{quote.amount}</p>
        </div>
      </div>
      <div className={styles.wallet}>
        <p className={styles.text}>Owner:</p>
        <p className={styles.text}>{address}</p>
      </div>
    </div>
  );
};
