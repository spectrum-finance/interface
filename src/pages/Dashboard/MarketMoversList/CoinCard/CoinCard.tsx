import styles from './CoinCard.module.less';

type CoinCardProps = {
  left: {
    title: string;
    subTitle: string;
  };
  right: {
    title: string;
    subTitle: string;
  };
  imgSrc: string;
};

export const CoinCard = ({ imgSrc, left, right }: CoinCardProps) => {
  return (
    <div className={styles.coinCard}>
      <div className={styles.leftSection}>
        <img
          width={40}
          height={40}
          className={styles.coinImage}
          src={imgSrc}
          alt={left.title}
        />
        <div className={styles.leftText}>
          <div className={styles.title}>{left.title}</div>
          <div className={styles.subTitle}>{left.subTitle}</div>
        </div>
      </div>
      <div className={styles.rightText}>
        <div className={styles.title}>{right.title}</div>
        <div className={`${styles.subTitle} ${styles.green}`}>
          {right.subTitle}
        </div>
      </div>
    </div>
  );
};
