import { FC, Fragment, PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { Position } from '../../../../../common/models/Position';
import { isDeprecatedPool } from '../../../../../common/utils/isDeprecatedPool.ts';
import { IsCardano } from '../../../../../components/IsCardano/IsCardano.tsx';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';
import { useApr } from '../../../../../network/cardano/api/ammPoolsStats/ammPoolsApr.ts';
import { formatToAda } from '../../../../../services/number.ts';
import {
  CHEVRON_DOWN,
  VERIFIED,
  WARNING,
} from '../../../../../utils/images.ts';
import { APR } from './APR.tsx';
import AssetPairDetail from './AssetPairDetail.tsx';
import styles from './PoolsOrPositionsTableView.module.less';
import PriceTokenDetail from './PriceTokensDetail.tsx';
import TvlTokensDetail from './TvlTokensDetail.tsx';
import { YieldFarmingReward } from './YieldFarmingReward.tsx';
import { YourTvl } from './YourTvl.tsx';
export interface PoolsOrPositionsTableViewProps<T extends AmmPool | Position> {
  readonly items: T[];
  readonly poolMapper: (item: T) => AmmPool | Position;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
  readonly myLiquidity: boolean;
  readonly isPositionsEmpty?: boolean;
  readonly loading?: boolean | undefined;
  readonly isPositionsLoading?: boolean | undefined;
}

export const PoolsOrPositionsTableView: FC<
  PropsWithChildren<PoolsOrPositionsTableViewProps<any>>
> = ({ poolMapper, items, myLiquidity }) => {
  const navigate = useNavigate();
  const [extendTable, setExtendTable] = useState<string | null>(null);
  const toggleExtendTable = (itemId: string) => {
    setExtendTable((prevId) => (prevId === itemId ? null : itemId));
  };

  const handleSwap = (token1, token2, poolid) =>
    navigate(
      `../../swap?base=${token1}&quote=${token2}&initialPoolId=${poolid}`,
    );

  const handleAddLiquidity = (poolid) => navigate(`${poolid}/add`);
  const handleManageLiquidity = (poolid) => navigate(`${poolid}`);

  const { calculateAPR, isLoading } = useApr(20_000);

  return (
    <>
      <main className={styles.poolsPositionTable}>
        <section className={styles.thead}>
          <article className={`${styles.row} ${styles.asset}`}>
            <p className={styles.value}>Asset Pair</p>
          </article>
          <article className={`${styles.row} ${styles.fee}`}>
            <p className={styles.value}>Fee</p>
          </article>
          <article className={`${styles.row} ${styles.apr}`}>
            <p className={styles.value}>APR</p>
          </article>
          <article className={`${styles.row} ${styles.tvl}`}>
            <p className={styles.value}>TVL</p>
          </article>
          {myLiquidity ? (
            <>
              <article className={`${styles.row} ${styles.yourTvl}`}>
                <p className={styles.value}>Your TVL</p>
              </article>
              <article className={`${styles.row} ${styles.apr}`}>
                <p className={styles.value}>Honey 🍯</p>
              </article>
            </>
          ) : (
            <article className={`${styles.row} ${styles.volume}`}>
              <p className={styles.value}>Volume 24H</p>
            </article>
          )}
        </section>
        <section className={styles.tbody}>
          {items.map((item) => {
            let infoPool;
            let infoPosition;
            if (!myLiquidity) {
              infoPool = poolMapper(item);
            } else {
              infoPool = poolMapper(item).pool;
              infoPosition = poolMapper(item);
            }
            return (
              <Fragment key={infoPool.id}>
                <div
                  className={styles.tbodyContent}
                  onClick={() => toggleExtendTable(infoPool.id)}
                  key={infoPool.id}
                >
                  <article className={`${styles.row} ${styles.asset}`}>
                    <AssetPairDetail assetX={infoPool.x} assetY={infoPool.y} />
                    <IsCardano>
                      {isDeprecatedPool(infoPool.id) ? (
                        <img src={WARNING} alt="warning" />
                      ) : (
                        <img src={VERIFIED} alt="verified" />
                      )}
                    </IsCardano>
                  </article>
                  <article className={`${styles.row} ${styles.fee}`}>
                    <IsCardano>
                      <p className={styles.value}>{infoPool.poolFee}%</p>
                    </IsCardano>
                  </article>
                  <article className={`${styles.row} ${styles.apr}`}>
                    <IsCardano>
                      <p className={styles.value}>
                        <APR
                          infoPool={infoPool}
                          calculateAPR={calculateAPR}
                          isLoading={isLoading}
                        />
                      </p>
                    </IsCardano>
                  </article>
                  <article className={`${styles.row} ${styles.tvl}`}>
                    <IsCardano>
                      <p className={styles.value}>
                        {infoPool.tvl
                          ? formatToAda(infoPool.tvl.toAmount(), 'abbr')
                          : 'N / A'}
                      </p>
                    </IsCardano>
                  </article>
                  {myLiquidity ? (
                    <>
                      <article className={`${styles.row} ${styles.yourTvl}`}>
                        <IsCardano>
                          <YourTvl
                            value={[infoPosition.totalX, infoPosition.totalY]}
                          />
                        </IsCardano>
                      </article>
                      <article className={`${styles.row} ${styles.apr}`}>
                        <IsCardano>
                          <p className={styles.value}>
                            <YieldFarmingReward
                              infoPool={infoPool}
                              infoPosition={infoPosition}
                              calculateAPR={calculateAPR}
                              isLoading={isLoading}
                            />
                          </p>
                        </IsCardano>
                      </article>
                    </>
                  ) : (
                    <article className={`${styles.row} ${styles.volume}`}>
                      <IsCardano>
                        <p className={styles.value}>
                          {infoPool.volume
                            ? formatToAda(infoPool.volume.toAmount(), 'abbr')
                            : 'N / A'}
                        </p>
                      </IsCardano>
                    </article>
                  )}
                  <svg
                    width="16"
                    height="16"
                    className={`${styles.icon} ${
                      extendTable === infoPool.id ? styles.open : ''
                    }`}
                  >
                    <use href={CHEVRON_DOWN} />
                  </svg>
                </div>
                <div
                  className={`${styles.details} ${
                    extendTable === infoPool.id ? styles.expanded : ''
                  }`}
                >
                  <div className={styles.poolInfo}>
                    <div className={styles.aprGroup}>
                      <h2 className={styles.titleDetails}>APR</h2>
                      <div className={styles.detailsContent}>
                        <IsCardano>
                          <p className={styles.value}>
                            <APR
                              infoPool={infoPool}
                              calculateAPR={calculateAPR}
                              isLoading={isLoading}
                            />
                          </p>
                        </IsCardano>
                      </div>
                    </div>
                    {myLiquidity ? (
                      <div className={styles.tvlGroup}>
                        <h2 className={styles.titleDetails}>TVL</h2>
                        <div className={styles.detailsContent}>
                          <IsCardano>
                            <p className={styles.value}>
                              {infoPool.tvl
                                ? formatToAda(infoPool.tvl.toAmount(), 'abbr')
                                : 'N / A'}
                            </p>
                          </IsCardano>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.volumeGroup}>
                        <h2 className={styles.titleDetails}>Volume 24H</h2>
                        <div className={styles.detailsContent}>
                          <IsCardano>
                            <p className={styles.value}>
                              {infoPool.volume
                                ? formatToAda(
                                    infoPool.volume.toAmount(),
                                    'abbr',
                                  )
                                : 'N / A'}
                            </p>
                          </IsCardano>
                        </div>
                      </div>
                    )}

                    <div className={styles.feeGroup}>
                      <h2 className={styles.titleDetails}>Fee</h2>
                      <div className={styles.detailsContent}>
                        <IsCardano>
                          <p className={styles.value}>{infoPool.poolFee}%</p>
                        </IsCardano>
                      </div>
                    </div>
                    <div className={styles.priceGroup}>
                      <h2 className={styles.titleDetails}>Price</h2>
                      <div className={styles.detailsContent}>
                        <PriceTokenDetail
                          tokenName1={
                            infoPool.x.asset.ticker || infoPool.x.asset.name
                          }
                          tokenName2={
                            infoPool.y.asset.ticker || infoPool.y.asset.name
                          }
                          priceToken1={infoPool.pool.priceX.numerator}
                          priceToken2={infoPool.pool.priceY.numerator}
                          decimalsToken1={infoPool.x.asset.decimals}
                          decimalsToken2={infoPool.y.asset.decimals}
                        />
                        <PriceTokenDetail
                          tokenName1={
                            infoPool.y.asset.ticker || infoPool.y.asset.name
                          }
                          tokenName2={
                            infoPool.x.asset.ticker || infoPool.x.asset.name
                          }
                          priceToken1={infoPool.pool.priceY.numerator}
                          priceToken2={infoPool.pool.priceX.numerator}
                          decimalsToken1={infoPool.y.asset.decimals}
                          decimalsToken2={infoPool.x.asset.decimals}
                        />
                      </div>
                    </div>
                    <div className={styles.totalLiquidityGroup}>
                      <h2 className={styles.titleDetails}>Total Liquidity</h2>
                      <div className={styles.detailsContent}>
                        <TvlTokensDetail
                          tokenName={
                            infoPool.x.asset.ticker || infoPool.x.asset.name
                          }
                          tvlToken={infoPool.pool.x.amount}
                          decimalsToken={infoPool.x.asset.decimals}
                        />
                        <TvlTokensDetail
                          tokenName={
                            infoPool.y.asset.ticker || infoPool.y.asset.name
                          }
                          tvlToken={infoPool.pool.y.amount}
                          decimalsToken={infoPool.y.asset.decimals}
                        />
                      </div>
                    </div>
                    {myLiquidity && (
                      <div className={styles.yourLiquidityGroup}>
                        <h2 className={styles.titleDetails}>Your Liquidity</h2>
                        <div className={styles.detailsContent}>
                          <TvlTokensDetail
                            tokenName={
                              infoPool.x.asset.ticker || infoPool.x.asset.name
                            }
                            tvlToken={infoPosition.totalX.amount}
                            decimalsToken={infoPool.x.asset.decimals}
                          />
                          <TvlTokensDetail
                            tokenName={
                              infoPool.y.asset.ticker || infoPool.y.asset.name
                            }
                            tvlToken={infoPosition.totalY.amount}
                            decimalsToken={infoPool.y.asset.decimals}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.poolActions}>
                    <button
                      className={styles.btnSwap}
                      onClick={() => {
                        handleSwap(
                          infoPool.x.asset.id,
                          infoPool.y.asset.id,
                          infoPool.id,
                        );
                      }}
                    >
                      Swap
                    </button>
                    <button
                      className={styles.btnLiquidity}
                      onClick={() => {
                        myLiquidity
                          ? handleManageLiquidity(infoPool.id)
                          : handleAddLiquidity(infoPool.id);
                      }}
                    >
                      {myLiquidity ? 'Manage Liquidity' : 'Add Liquidity'}
                    </button>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </section>
      </main>
    </>
  );
};
