import { FC } from 'react';

// import useFetchRewards from '../../../common/hooks/useFetchRewards';
// import { useObservable } from '../../../common/hooks/useObservable';
// import useWindowSize from '../../../common/hooks/useResponsive';
// import { isWalletSetuped$ } from '../../../gateway/api/wallets';
// import { settings$ } from '../../../gateway/settings/settings';
// import { SEARCH } from '../../../utils/images';
import { LiquidityLayoutProps } from '../common/types/LiquidityLayoutProps';
import { LiquidityState } from '../common/types/LiquidityState';
// import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';
// import Rewards from './components/Rewards/Rewards';
// import { YourPositions } from './components/YourPositions/YourPositions';
import styles from './LiquidityDefaultLayout.module.less';
import { LiquidityTable } from './LiquidityTable/LiquidityTable';

export const LiquidityDefaultLayout: FC<LiquidityLayoutProps> = ({
  ammPools,
  isAmmPoolsLoading,
  handleSearchTerm,
  activeState,
  setActiveState,
  positions,
  isPositionsEmpty,
  isPositionsLoading,
}) => {
  // const [isWalletConnected] = useObservable(isWalletSetuped$);
  // const { width } = useWindowSize();
  // const [settings] = useObservable(settings$);
  // const { data, isLoading /* , error  */ } = useFetchRewards(
  //   settings?.address ? settings.address : '',
  // );

  return (
    <>
      <div className={styles.selectTabGroup}>
        <p
          onClick={() => setActiveState(LiquidityState.POOLS_OVERVIEW)}
          className={`${styles.tab} ${
            activeState === LiquidityState.POOLS_OVERVIEW ? styles.active : ''
          }`}
        >
          All Liquidity
        </p>
        <p
          onClick={() => setActiveState(LiquidityState.YOUR_POSITIONS)}
          className={`${styles.tab} ${
            activeState === LiquidityState.YOUR_POSITIONS ? styles.active : ''
          }`}
        >
          Your Liquidity
        </p>
      </div>

      <LiquidityTable
        ammPools={ammPools}
        isAmmPoolsLoading={isAmmPoolsLoading}
        activeState={activeState}
        handleSearchTerm={handleSearchTerm}
        positions={positions}
        isPositionsEmpty={isPositionsEmpty}
        isPositionsLoading={isPositionsLoading}
      />

      {/* <div className={styles.liquidityContainer}>
        <div className={styles.headerLiquidity}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              className={styles.inputSearch}
              placeholder="Token name, ticker, or policy id"
              onChange={handleSearchTerm}
            />
            <svg width="16" height="16" className={styles.icon}>
              <use href={SEARCH} />
            </svg>
          </div>
          {activeState === LiquidityState.YOUR_POSITIONS && (
            <div className={styles.harvestGroup}>
              {isWalletConnected && (
                <Rewards
                  width={width}
                  data={data === null ? 0 : data}
                  isLoading={isLoading}
                />
              )}

              <button
                className={styles.btnHarvest}
                disabled={!isWalletConnected || data === null || isLoading}
              >
                Harvest Honey 🍯
              </button>
            </div>
          )}
        </div>

        <div className={styles.ContentLiquidity}>
          {activeState === LiquidityState.POOLS_OVERVIEW && (
            <>
              <PoolsOverview
                ammPools={ammPools}
                loading={isAmmPoolsLoading}
                myLiquidity={false}
              />
            </>
          )}
          {activeState === LiquidityState.YOUR_POSITIONS && (
            <>
              <YourPositions
                positions={positions}
                isPositionsEmpty={isPositionsEmpty}
                isPositionsLoading={isPositionsLoading}
                myLiquidity={true}
              />
            </>
          )}
        </div>
      </div> */}
    </>
  );
};
