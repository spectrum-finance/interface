import useFetchRewards from '../../../../common/hooks/useFetchRewards';
import { useObservable } from '../../../../common/hooks/useObservable';
import useWindowSize from '../../../../common/hooks/useResponsive';
import { isWalletSetuped$ } from '../../../../gateway/api/wallets';
import { settings$ } from '../../../../gateway/settings/settings';
import { SEARCH } from '../../../../utils/images';
import { LiquidityPoolsOverviewProps } from '../../common/types/LiquidityPoolsOverviewProps';
import { LiquidityState } from '../../common/types/LiquidityState';
import { LiquidityYourPositionsProps } from '../../common/types/LiquidityYourPositionsProps';
import { PoolsOverview } from '../components/PoolsOverview/PoolsOverview';
import Rewards from '../components/Rewards/Rewards';
import { YourPositions } from '../components/YourPositions/YourPositions';
import styles from './LiquidityTable.module.less';

type LiquidityTableProps = {
  readonly activeState: LiquidityState;
  handleSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & LiquidityPoolsOverviewProps &
  LiquidityYourPositionsProps;

export const LiquidityTable = ({
  activeState,
  handleSearchTerm,
  ammPools,
  isAmmPoolsLoading,
  isPositionsEmpty,
  isPositionsLoading,
  positions,
}: LiquidityTableProps) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const { width } = useWindowSize();

  const [settings] = useObservable(settings$);
  const { data, isLoading /* , error  */ } = useFetchRewards(
    settings?.address ? settings.address : '',
  );

  return (
    <div className={styles.liquidityContainer}>
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
              /* onClick={openChooseWalletModal} */
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
    </div>
  );
};
