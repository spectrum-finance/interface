import useDeposit from '../DepositBox/useDeposit';
import Card from './Card';
import styles from './TokenCards.module.less';

function formatBalance(balanceBigInt: bigint) {
  const oneMillion = BigInt(1_000_000);
  const oneThousand = BigInt(1_000);

  // Convert lovelace to ADA
  const balanceInAda = balanceBigInt / oneMillion;
  const balanceInAdaWithPrecision = Number(balanceBigInt) / 1_000_000;

  const formatWithTwoDecimals = (
    value: number,
    divisor: number,
    suffix: string,
  ) => {
    const integerPart = Math.floor(value / divisor);
    const fractionalPart = value - integerPart * divisor;
    const rounded = integerPart + fractionalPart / divisor;
    return `${rounded.toFixed(2)}${suffix}`;
  };

  if (balanceInAda < oneThousand) {
    // For values less than 1,000, display as a decimal number with two decimal places
    return formatWithTwoDecimals(balanceInAdaWithPrecision, 1, '');
  }
  if (balanceInAda < oneMillion) {
    // For values between 1,000 and 1,000,000, format as 'k' with two decimal places
    return formatWithTwoDecimals(balanceInAdaWithPrecision, 1_000, 'k');
  }
  // For values 1,000,000 and above, format as 'm' with two decimal places
  return formatWithTwoDecimals(balanceInAdaWithPrecision, 1_000_000, 'm');
}

export default function TokenCards() {
  const { lovelaceBalance } = useDeposit();

  const adaBalance = formatBalance(lovelaceBalance);

  const tedyAvailable = `800,000`;

  const tokenCard = [
    {
      header: 'ADA deposited',
      value: `ADA ${adaBalance}`,
    },
    {
      header: 'TEDY available',
      value: `TEDY ${tedyAvailable}`,
    },
    {
      header: 'Deposit Ratio',
      value: '0.444 TEDY / ADA',
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
