import { Flex, Tooltip } from '@ergolabs/ui-kit';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

import { useSubject } from '../../../common/hooks/useObservable.ts';
import { getOperations } from '../../../gateway/api/transactionsHistory.ts';
import {
  CHEVRON_DOWN,
  ICON_COPY,
  ICON_EXPLORE,
  ICON_POINTS,
} from '../../../utils/images.ts';
import AssetDetail from './assets/AssetDetail.tsx';
import { CancelOrderCell } from './cells/CancelOrderCell/CancelOrderCell.tsx';
import styles from './OperationHistory.module.less';
import { OperationPagination } from './OperationPagination/OperationPagination.tsx';
import { ErrorState } from './states/ErrorState/ErrorState.tsx';
import TableLoadingHistory from './TableLoadingHistory.tsx';

const LIMIT = 25;

export const OperationHistoryV3 = () => {
  const [offset, setOffset] = useState<number>(0);
  const [copyTxId, setCopyTxID] = useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<string>('');
  const [isOpen, setIsOpen] = useState<string>('');

  const [operationsData, loadOperations, loading, error] =
    useSubject(getOperations);

  useEffect(() => {
    loadOperations(LIMIT, offset);
  }, [offset]);

  const reloadOperations = () => loadOperations(LIMIT, offset);

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

  const handleCopyTxID = (tx) => {
    navigator.clipboard
      .writeText(tx)
      .then(() => {
        setCopyTxID(true);
        setTimeout(() => {
          setCopyTxID(false);
        }, 1000);
      })
      .catch(() => {
        setCopyTxID(false);
      });
  };

  const handleClickMore = (string) => {
    setIsOpenMore((prevItemId) => (prevItemId === string ? '' : string));
  };

  const handleClickOpen = (string) => {
    setIsOpen((prevItemId) => (prevItemId === string ? '' : string));
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest(`.${styles.actionMore}`)) {
        return;
      }
      setIsOpenMore('');
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleExplore = (tx) => {
    window.open(`https://cardanoscan.io/transaction/${tx}`, '_blank');
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

  const { width } = useWindowSize();
  const widthSizeXL = 1000;
  const widthSizeL = 820;
  const widthSizeM = 690;
  const widthSizeS = 500;

  return (
    <>
      <main className={styles.operationHistoryContainer}>
        <h2 className={styles.titleContainer}>Transaction History</h2>
        {loading ? (
          <TableLoadingHistory />
        ) : !loading && !!error ? (
          <ErrorState onReloadClick={reloadOperations} />
        ) : (
          <>
            <section className={styles.transactionsTable}>
              <div className={styles.thead}>
                <article className={`${styles.row} ${styles.asset}`}>
                  <p className={styles.value}>Assets</p>
                </article>
                {width > widthSizeM && (
                  <article className={`${styles.row} ${styles.action}`}>
                    <p className={styles.value}>Action</p>
                  </article>
                )}

                {width > widthSizeXL && (
                  <article className={`${styles.row} ${styles.date}`}>
                    <p className={styles.value}>Date & Time</p>
                  </article>
                )}
                {width > widthSizeL && (
                  <article className={`${styles.row} ${styles.status}`}>
                    <p className={styles.value}>Status</p>
                  </article>
                )}
                {width > widthSizeS && (
                  <article className={`${styles.row} ${styles.actions}`}>
                    <p className={styles.value}>Actions</p>
                  </article>
                )}
              </div>
              <div className={styles.tbody}>
                {operationsData?.[0].map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.rowTable} ${
                      isOpen === item.id ? styles.open : ''
                    }`}
                  >
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
                      {width > widthSizeM && (
                        <article className={`${styles.row} ${styles.action}`}>
                          <p className={styles.value}>
                            {formatType(item.type)}
                          </p>
                        </article>
                      )}

                      {width > widthSizeXL && (
                        <article className={`${styles.row} ${styles.date}`}>
                          <p className={styles.value}>
                            {item.registerTx.dateTime.toFormat(
                              'MMMM d, yyyy h:mm a',
                            )}
                          </p>
                        </article>
                      )}
                      {width > widthSizeL && (
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
                      )}

                      <article className={`${styles.row} ${styles.actions}`}>
                        {width > widthSizeS && (
                          <Tooltip title="Copy Transaction ID" trigger="hover">
                            <div
                              className={styles.iconAction}
                              onClick={() => handleCopyTxID(item.registerTx.id)}
                            >
                              <img
                                src={ICON_COPY}
                                alt="copy"
                                className={styles.icon}
                              />
                            </div>
                          </Tooltip>
                        )}
                        {width > widthSizeS && (
                          <Tooltip title="View on explorer" trigger="hover">
                            <div
                              className={styles.iconAction}
                              onClick={() => handleExplore(item.registerTx.id)}
                            >
                              <img
                                src={ICON_EXPLORE}
                                alt="explore"
                                className={styles.icon}
                              />
                            </div>
                          </Tooltip>
                        )}

                        {width > widthSizeXL ? (
                          <div
                            className={`${styles.iconAction} ${styles.actionMore}`}
                            onClick={() => handleClickMore(item.id)}
                          >
                            <img
                              src={ICON_POINTS}
                              alt="points"
                              className={styles.icon}
                            />
                            {isOpenMore === item.id && (
                              <div className={styles.btnMore}>
                                <CancelOrderCell operationItem={item} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={styles.iconAction}
                            onClick={() => handleClickOpen(item.id)}
                          >
                            <svg
                              width="15"
                              height="15"
                              className={`${styles.icon} ${
                                isOpen === item.id ? styles.open : ''
                              }`}
                            >
                              <use href={CHEVRON_DOWN} />
                            </svg>
                          </div>
                        )}
                      </article>
                    </div>
                    {width < 1000 && (
                      <section
                        className={`${styles.expanded} ${
                          isOpen === item.id ? styles.open : ''
                        }`}
                      >
                        <div className={`${styles.itemGroup} ${styles.date}`}>
                          <h3 className={styles.title}>Date & Time</h3>
                          <article className={styles.value}>
                            <p className={styles.value}>
                              {item.registerTx.dateTime.toFormat(
                                'MMMM d, yyyy h:mm a',
                              )}
                            </p>
                          </article>
                        </div>
                        {width <= widthSizeL && (
                          <div
                            className={`${styles.itemGroup} ${styles.status}`}
                          >
                            <h3 className={styles.title}>Status</h3>
                            <article className={styles.value}>
                              <div
                                className={styles.statusIcon}
                                style={{
                                  backgroundColor: statusType(item.status)
                                    .color,
                                }}
                              />
                              <p className={styles.value}>
                                {statusType(item.status).label}
                              </p>
                            </article>
                          </div>
                        )}
                        {width <= widthSizeM && (
                          <div
                            className={`${styles.itemGroup} ${styles.action}`}
                          >
                            <h3 className={styles.title}>Action</h3>
                            <article className={styles.value}>
                              <p className={styles.value}>
                                {formatType(item.type)}
                              </p>
                            </article>
                          </div>
                        )}
                        {width <= widthSizeS && (
                          <div
                            className={`${styles.itemGroup} ${styles.actions}`}
                          >
                            <h3 className={styles.title}>Actions</h3>
                            <article className={styles.value}>
                              <Tooltip
                                title="Copy Transaction ID"
                                trigger="hover"
                              >
                                <div
                                  className={styles.iconAction}
                                  onClick={() =>
                                    handleCopyTxID(item.registerTx.id)
                                  }
                                >
                                  <img
                                    src={ICON_COPY}
                                    alt="copy"
                                    className={styles.icon}
                                  />
                                </div>
                              </Tooltip>
                              <Tooltip title="View on explorer" trigger="hover">
                                <div
                                  className={styles.iconAction}
                                  onClick={() =>
                                    handleExplore(item.registerTx.id)
                                  }
                                >
                                  <img
                                    src={ICON_EXPLORE}
                                    alt="explore"
                                    className={styles.icon}
                                  />
                                </div>
                              </Tooltip>
                            </article>
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                ))}
                {copyTxId && (
                  <div className={styles.copied}>
                    <p className={styles.text}>TxId successfully copied</p>
                  </div>
                )}
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
