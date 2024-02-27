import { ReactComponent } from '../../../assets/icons/icon-sun-blue.svg';
import { LeftTextWithRightSunText } from '../LeftTextWithRightSunText/LeftTextWithRightSunText';
import styles from './BachersCard.module.less';

const SingleItem = () => {
  return (
    <div className={styles.singleItem}>
      <ReactComponent className={styles.image} />
      <div className={styles.rightSection}>
        <div className={styles.title}>₳3,303,930.12</div>
        <div className={styles.subTitle}>Distributed to Batchers</div>
      </div>
    </div>
  );
};

export const BatchersCard = () => {
  return (
    <div className={styles.batchersCard}>
      <LeftTextWithRightSunText
        left={{ title: 'Batchers' }}
        right={{ title: '₳203,930.12', subTitle: 'Distributed this week' }}
      />
      <div className={styles.bottomSection}>
        <div className={styles.itemsList}>
          <SingleItem />
          <SingleItem />
          <SingleItem />
        </div>
        <div className={styles.btnList}>
          <button className={styles.btnPrimary}>Run a Batcher</button>
          <button className={styles.btnPrimary}>View Github</button>
          <button className={styles.btnPrimary}>Learn More</button>
        </div>
      </div>
    </div>
  );
};
