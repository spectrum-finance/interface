import { Flex } from '@ergolabs/ui-kit';
import { Fragment, useEffect, useState } from 'react';

import { useSubject } from '../../../common/hooks/useObservable.ts';
import { getOperations } from '../../../gateway/api/transactionsHistory.ts';
import AssetDetail from './assets/AssetDetail.tsx';
import styles from './OperationHistory.module.less';
import { OperationPagination } from './OperationPagination/OperationPagination.tsx';

const LIMIT = 10; //25

export const OperationHistoryV3 = () => {
  const [offset, setOffset] = useState<number>(0);

  const [operationsData, loadOperations, loading /* , error */] =
    useSubject(getOperations);

  useEffect(() => {
    loadOperations(LIMIT, offset);
  }, [offset]);

  //const reloadOperations = () => loadOperations(LIMIT, offset);

  console.log(operationsData?.[0]);

  const formatType = (type: string): string => {
    switch (type) {
      case 'RemoveLiquidity':
        return 'Remove Liquidity';
      case 'AddLiquidity':
        return 'Add Liquidity';
      default:
        return type;
    }
  };

  const statusType = (status: string): { label: string; color: string } => {
    switch (status) {
      case 'Evaluated':
        return { label: 'Complete', color: '#10B981' };
      case 'Refunded':
        return { label: 'Canceled', color: '#899398' };
      default:
        return { label: 'Processing', color: '#E8D648' };
    }
  };

  return (
    <>
      <main className={styles.operationHistoryContainer}>
        <h2 className={styles.titleContainer}>Transaction History</h2>
        {loading ? (
          <div>Loading</div>
        ) : (
          <>
            <section className={styles.transactionsTable}>
              <div className={styles.thead}>
                <article className={`${styles.row} ${styles.asset}`}>
                  <p className={styles.value}>Assets</p>
                </article>
                <article className={`${styles.row} ${styles.action}`}>
                  <p className={styles.value}>Action</p>
                </article>
                <article className={`${styles.row} ${styles.date}`}>
                  <p className={styles.value}>Date & Time</p>
                </article>
                <article className={`${styles.row} ${styles.status}`}>
                  <p className={styles.value}>Status</p>
                </article>
                <article className={`${styles.row} ${styles.actions}`}>
                  <p className={styles.value}>Actions</p>
                </article>
              </div>
              <div className={styles.tbody}>
                {operationsData?.[0].map((item) => (
                  <Fragment key={item.id}>
                    <div className={styles.tbodyContent}>
                      <article className={`${styles.row} ${styles.asset}`}>
                        <AssetDetail
                          assetNameX={
                            item.type === 'Swap'
                              ? item.base.asset.ticker
                              : item.pool.x.asset.ticker ||
                                item.pool.x.asset.name
                          }
                          assetNameY={
                            item.type === 'Swap'
                              ? item.quote.asset.ticker
                              : item.pool.y.asset.ticker ||
                                item.pool.y.asset.name
                          }
                          type={item.type}
                          iconX={
                            item.type === 'Swap'
                              ? item.base.asset.icon
                              : item.pool.x.asset.icon
                          }
                          iconY={
                            item.type === 'Swap'
                              ? item.quote.asset.icon
                              : item.pool.y.asset.icon
                          }
                          valueX={
                            item.type === 'Swap'
                              ? item.base.amount
                              : 'x' in item
                              ? item.x.amount
                              : undefined
                          }
                          decimalsX={
                            item.type === 'Swap'
                              ? item.base.asset.decimals
                              : item.pool.x.asset.decimals
                          }
                          valueY={
                            item.type === 'Swap'
                              ? item.quote.amount
                              : 'y' in item
                              ? item.y.amount
                              : undefined
                          }
                          decimalsY={
                            item.type === 'Swap'
                              ? item.quote.asset.decimals
                              : item.pool.y.asset.decimals
                          }
                        />
                      </article>
                      <article className={`${styles.row} ${styles.action}`}>
                        <p className={styles.value}>{formatType(item.type)}</p>
                      </article>
                      <article className={`${styles.row} ${styles.date}`}>
                        <p className={styles.value}>
                          {item.registerTx.dateTime.toFormat(
                            'MMMM d, yyyy h:mm a',
                          )}
                        </p>
                      </article>
                      <article className={`${styles.row} ${styles.status}`}>
                        <div
                          className={styles.statusIcon}
                          style={{
                            backgroundColor: statusType(item.status).color,
                          }}
                        />
                        <p className={styles.value}>
                          {statusType(item.status).label}
                        </p>
                      </article>
                      <article className={`${styles.row} ${styles.actions}`}>
                        <p className={styles.value}>gfh</p>
                      </article>
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
            {operationsData?.[1] ? (
              <Flex.Item marginTop={4}>
                <OperationPagination
                  onOffsetChange={setOffset}
                  limit={LIMIT}
                  offset={offset}
                  total={operationsData?.[1] || 0}
                />
              </Flex.Item>
            ) : (
              ''
            )}
          </>
        )}
      </main>
    </>
  );
};
