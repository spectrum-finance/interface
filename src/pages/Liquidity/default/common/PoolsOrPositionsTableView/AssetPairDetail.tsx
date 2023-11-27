import styles from './AssetPairDetail.module.less';

interface AssetPairDetailProps {
  assetX: any;
  assetY: any;
}

export default function AssetPairDetail(props: AssetPairDetailProps) {
  const { assetX, assetY } = props;

  return (
    <div className={styles.assetGroup}>
      <div className={styles.logoGroup}>
        <img src={assetX.asset.icon} alt="logo" className={styles.logo} />
        <img src={assetY.asset.icon} alt="logo" className={styles.logo} />
      </div>
      <p className={styles.name}>
        {assetX.asset.ticker || assetX.asset.name}/
        {assetY.asset.ticker || assetY.asset.name}
      </p>
    </div>
  );
}
