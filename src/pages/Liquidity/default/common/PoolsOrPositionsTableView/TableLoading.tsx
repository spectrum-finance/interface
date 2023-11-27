import styles from './PoolsOrPositionsTableView.module.less';

export default function TableLoading() {
  const skeletonData = Array(5)
    .fill(null)
    .map((_, index) => ({
      _DB_id: index,
    }));
  return (
    <main className={styles.poolsPositionTable}>
      <section className={styles.thead}>
        <article className={`${styles.row} ${styles.asset}`}>
          <p className={styles.value}>Asset Pair</p>
        </article>
        <article className={`${styles.row} ${styles.tvl}`}>
          <p className={styles.value}>TVL</p>
        </article>
        <article className={`${styles.row} ${styles.volume}`}>
          <p className={styles.value}>Volume 24H</p>
        </article>
        <article className={`${styles.row} ${styles.fee}`}>
          <p className={styles.value}>LP Fee</p>
        </article>
      </section>
      <section className={`${styles.tbody} ${styles.loading}`}>
        {skeletonData.map((fund) => (
          <div className={styles.tbodyContent} key={fund._DB_id} />
        ))}
      </section>
    </main>
  );
}
