import { Modal } from '@ergolabs/ui-kit';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useObservable } from '../../../common/hooks/useObservable';
import { Position } from '../../../common/models/Position';
import { isDeprecatedPool } from '../../../common/utils/isDeprecatedPool';
import { ChooseWalletModal } from '../../../components/common/ConnectWalletButton/ChooseWalletModal/ChooseWalletModal';
import { isWalletSetuped$ } from '../../../gateway/api/wallets';
import { hasFarmsForPool } from '../../../network/ergo/lm/api/farms/farms';
import { MyLiquidity } from './MyLiquidity/MyLiquidity';
import PoolDetailAsset from './PoolDetailAsset';
import styles from './PoolInfoView.module.less';
import { TotalLiquidity } from './TotalLiquidity/TotalLiquidity';
import { YieldFarming } from './YieldFarming/YieldFarming';

export interface PoolInfoProps {
  readonly position: Position;
}

export const PoolInfoView: FC<PoolInfoProps> = ({ position }) => {
  const navigate = useNavigate();
  const [hasFarmForPool] = useObservable(hasFarmsForPool(position.pool.id), []);

  const handleFarmsButtonClick = () =>
    navigate(`../../../farm?searchString=${position?.pool.id}`);

  const handleRemovePositionClick = () => navigate(`remove`);

  const handleAddLiquidity = () => navigate(`add`);

  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const openChooseWalletModal = (): void => {
    Modal.open(({ close }) => <ChooseWalletModal close={close} />);
  };

  return (
    <section className={styles.poolInfoViewContainer}>
      <div className={styles.poolTitle}>
        <div className={styles.asset}>
          <PoolDetailAsset assetX={position.pool.x} assetY={position.pool.y} />
          <p className={styles.fee}>{position.pool.poolFee}%</p>
        </div>
        {isDeprecatedPool(position.pool.id) ? (
          <p className={styles.deprecated}>Deprecated</p>
        ) : (
          <div className={styles.btnGroup}>
            {hasFarmForPool && (
              <button
                className={styles.btnFarm}
                onClick={handleFarmsButtonClick}
              >
                Farm
              </button>
            )}
            <p className={styles.harvest}>Harvest Honey 🍯</p>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <TotalLiquidity position={position} />
        <MyLiquidity position={position} />
        <YieldFarming position={position} />
        {isDeprecatedPool(position.pool.id) && (
          <p className={styles.deprecated}>
            A more secure variant of this pool is available. We advise you to
            migrate your liquidity to a new one.
          </p>
        )}
      </div>
      <div className={styles.btnActions}>
        {!isWalletConnected ? (
          <button
            className={styles.btnLiquidity}
            onClick={openChooseWalletModal}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <button
              className={styles.btnAdd}
              onClick={handleAddLiquidity}
              disabled={isDeprecatedPool(position.pool.id)}
            >
              Add Liquidity
            </button>
            <button
              className={styles.btnRemove}
              onClick={handleRemovePositionClick}
            >
              Remove Liquidity
            </button>
          </>
        )}
      </div>
    </section>
  );
};
