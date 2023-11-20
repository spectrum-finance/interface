import styles from './FaqDetails.module.less';

export default function FaqDetails() {
  return (
    <article className={styles.detailsFAQ}>
      <h2 className={styles.title}>LBE Details</h2>
      <div className={styles.description}>
        <p className={styles.text}>
          The Liquidity Bootstrapping Event (LBE) is designed to bolster
          liquidity for the TEDY/ADA pool at launch. Participants can exchange
          ADA for TEDY at a ratio of 0.444 TEDY per ADA, starting Nov 23rd, 1PM
          UTC.
        </p>
        <p className={styles.text}>
          <b>Pro-Rata Distribution Explained</b>
          <br />
          <br />
          The LBE facilitates an equitable distribution of TEDY tokens in
          exchange for ADA contributions. Here&apos;s an outline of the process:
          <br />
          <br />
          <b>All Contributions Counted:</b> We accept all ADA contributions
          during the 3-hour LBE window, irrespective of the 2 million ADA cap.
          <br />
          <br />
          <b>Proportional Allocation:</b> TEDY tokens are allocated in
          proportion to each participant&apos;s contribution compared to the
          total ADA received.
          <br />
          <br />
          <b>Refunding Excess:</b> Contributions beyond the 2 million ADA cap
          are proportionally refunded, ensuring each participant receives their
          rightful share of TEDY tokens.
          <br />
          <br />
          <b>Example:</b> If the total ADA received is 4 million and you
          contribute 40,000 ADA, your share is 1% of the total (40,000 /
          4,000,000). Consequently, you receive 1% of the 800,000 TEDY tokens
          (8,000 TEDY) and a 50% refund of your ADA contribution (20,000 ADA),
          in line with the oversubscription.
          <br />
          <br />
          This approach guarantees fair distribution, full participation within
          the timeframe, and upholds the tokenomics integrity by returning
          surplus ADA.
          <br />
          <br />
          <b>
            Teddy Bears Club Round 1 holders will earn a 1% bonus on the LBE and
            Teddy Bears Club Round 2 holders will earn a 0.4% bonus for each NFT
            they hold. If someone holds 10 Round 2 Teddy Bears, they&apos;ll
            earn a 4% bonus. All bonuses will be vested over 6 months, while the
            actual contributions will be distributed immediately along with the
            rest of the community.
          </b>
        </p>
        <p className={styles.text}>
          Please ensure you understand and agree to these terms before
          participating.
        </p>
      </div>
    </article>
  );
}
