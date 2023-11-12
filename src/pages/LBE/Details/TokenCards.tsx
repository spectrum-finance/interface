import Card from './Card';
import styles from './TokenCards.module.less';

export default function TokenCards() {
  const adaDeposited = 5000;
  const tedyAvailable = `100M`;

  const tokenCard = [
    {
      header: 'ADA deposited',
      value: `ADA ${adaDeposited}`,
    },
    {
      header: 'TEDY available',
      value: `TEDY ${tedyAvailable}`,
    },
    {
      header: 'Deposit Ratio',
      value: '5 ADA = 1 TEDY',
    },
  ];

  return (
    <section className={styles.cardsGroup}>
      {tokenCard.map((item, index) => (
        <Card key={index} header={item.header} value={item.value} />
      ))}
    </section>
  );
}
