import styles from './PriceTokenDetail.module.less';

interface PriceTokenDetailProps {
  tokenName1: any;
  tokenName2: any;
  priceToken1: any;
  priceToken2: any;
  decimalsToken1: any;
  decimalsToken2: any;
}

export default function PriceTokenDetail(props: PriceTokenDetailProps) {
  const {
    tokenName1,
    tokenName2,
    priceToken1,
    priceToken2,
    decimalsToken1,
    decimalsToken2,
  } = props;

  const result = (
    (Number(priceToken1) / Number(priceToken2)) *
    Math.pow(10, decimalsToken1 - decimalsToken2)
  ).toFixed(decimalsToken2);

  return (
    <p className={styles.value}>
      1 {tokenName1} = {result} {tokenName2}
    </p>
  );
}
