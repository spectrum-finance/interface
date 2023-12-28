import { formatToToken } from '../../../../services/number';
import { ARROW_RIGHT, PLUS } from '../../../../utils/images';
import styles from './AssetDetail.module.less';

interface AssetPairDetailProps {
  assetNameX: string | undefined;
  assetNameY: string | undefined;
  type: string;
  iconX: string | undefined;
  iconY: string | undefined;
  valueX: bigint | undefined;
  decimalsX: number | undefined;
  valueY: bigint | undefined;
  decimalsY: number | undefined;
}

export default function AssetDetail(props: AssetPairDetailProps) {
  const {
    assetNameX,
    assetNameY,
    type,
    iconX,
    iconY,
    valueX,
    valueY,
    decimalsX,
    decimalsY,
  } = props;
  const valueTokenX = formatToToken(
    Number(valueX) /
      (Number(decimalsX) === 0 ? 1 : Math.pow(10, Number(decimalsX))),
    'abbr',
  );

  const valueTokenY = formatToToken(
    Number(valueY) /
      (Number(decimalsY) === 0 ? 1 : Math.pow(10, Number(decimalsY))),
    'abbr',
  );

  const iconType = () => {
    const iconType = type;
    switch (iconType) {
      case 'RemoveLiquidity':
        return `${PLUS}`;
      case 'AddLiquidity':
        return `${PLUS}`;
      default:
        return `${ARROW_RIGHT}`;
    }
  };

  return (
    <div className={styles.detailGroup}>
      <div className={styles.assetGroup}>
        <img src={iconX} alt="logo" className={styles.logo} />
        <p className={styles.name}>{assetNameX}</p>
        <p className={styles.value}>{valueTokenX}</p>
      </div>
      <div className={styles.iconAsset}>
        <svg width="20" height="20" className={styles.icon}>
          <use href={iconType()} />
        </svg>
      </div>
      <div className={styles.assetGroup}>
        <img src={iconY} alt="logo" className={styles.logo} />
        <p className={styles.name}>{assetNameY}</p>
        <p className={styles.value}>{valueTokenY}</p>
      </div>
    </div>
  );
}
