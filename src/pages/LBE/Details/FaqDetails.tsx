import styles from './FaqDetails.module.less';

export default function FaqDetails() {
  return (
    <article className={styles.detailsFAQ}>
      <h2 className={styles.title}>LBE Details</h2>
      <div className={styles.description}>
        <p className={styles.text}>
          Liquidity Boot strapping is an initiative to ensure the TEDY/ADA pool
          is sufficiently liquid at launch. By supplying ADA in this event,
          participants will be effectively swapping the ADA they supply for
          TEDY, at the ratio of 1 TEDY = 5 ADA. Starting on Nov 18th, you can
          start to claim your TEDY.
        </p>
        <p className={styles.text}>
          The maximum TEDY available is 200,000, representing 2.5% of the total
          supply of 8 million TEDY. Depositors will receive TEDY in a ratio of 1
          TEDY per 5 ADA deposited. If more than 1M ADA is deposited (equivalent
          to the full sale of 200k TEDY), depositors will receive a number of
          TEDY proportional to the amount of ADA they deposited relative to the
          total number of ADA deposited in the LBE. Remaining ADA above 1M will
          be distributed back to users proportional to their total LBE deposits.
        </p>
        <p className={styles.text}>
          Please read our TeddySwap
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {' '}
            LBE FAQ{' '}
          </a>
          before aping in.
        </p>
      </div>
    </article>
  );
}
