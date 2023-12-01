import styles from './PoolDetailAsset.module.less';

interface PoolDatailAssetProps {
  assetX: any;
  assetY: any;
}

export default function PoolDatailAsset(props: PoolDatailAssetProps) {
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
