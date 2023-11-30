import styles from './TokenDetail.module.less';

interface TvlTokensDetailProps {
  tokenName: any;
  tvlToken: any;
  decimalsToken: any;
}

export default function TvlTokensDetail(props: TvlTokensDetailProps) {
  const { tokenName, tvlToken, decimalsToken } = props;

  const formatAmount = (value: number) => {
    const formated = Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/\.?0+$/, '');
    return formated;
  };

  const decimals = decimalsToken ? Number(decimalsToken) : 0;
  const tvl =
    decimalsToken !== 0
      ? Number(tvlToken) / Math.pow(10, decimals)
      : Number(tvlToken);

  return (
    <p className={styles.value}>
      {tokenName}: {formatAmount(tvl)}
    </p>
  );
}
