import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { Typography } from '@ergolabs/ui-kit';
import { AssetAmount, TxCandidate } from '@teddyswap/cardano-dex-sdk';
import { useEffect, useMemo } from 'react';
import { first, map, switchMap } from 'rxjs';

import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { useSettings } from '../../gateway/settings/settings';
import { submitTx } from '../../network/cardano/api/operations/common/submitTxCandidate';
import { transactionBuilder$ } from '../../network/cardano/api/operations/common/transactionBuilder';
import { settings } from '../../network/cardano/settings/settings';
import styles from './Rewards.module.less';

export const Rewards = (): JSX.Element => {
  const { address } = useSettings();
  const [balance, isLoading] = useAssetsBalance();

  const withdrawRequestAddress =
    'addr1q90n2rk4rurl3llmgq23ac5jw9lql8jgrn8p5a8cvv2hk8e642sq428m5mu0cemuc63spyr7nnn69tsh0lyrkqgnu38sn5efhm';

  const tbcPolicies = [
    'ab182ed76b669b49ee54a37dee0d0064ad4208a859cc4fdf3f906d87',
    'da3562fad43b7759f679970fb4e0ec07ab5bebe5c703043acda07a3c',
  ];

  const userNftAssets = useMemo(() => {
    const assets = balance.values().map(
      (v) =>
        new AssetAmount(
          {
            policyId: v.asset.data.policyId,
            name: v.asset.data.name,
            nameHex: v.asset.data.nameHex,
          },
          v.asset.data.quantity,
        ),
    );

    return assets.filter(
      (asset) => tbcPolicies.indexOf(asset.asset.policyId) !== -1,
    );
  }, [balance, isLoading]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<any>) => {
      if (event.data.harvest === true) {
        const lovelace = userNftAssets.length >= 1 ? 5_000_000n : 2_000_000n;
        if (isLoading) return;
        toSendAssetsTxCandidate(lovelace, [...userNftAssets])
          .pipe(switchMap((tx) => submitTx(tx)))
          .subscribe({
            complete: () => {},
          });
      }
    };

    const toSendAssetsTxCandidate = (
      lovelace: bigint,
      assets: AssetAmount[],
    ) => {
      return transactionBuilder$.pipe(
        switchMap((txBuilder) => {
          return txBuilder.sendAssetToAddress({
            lovelace,
            assets,
            changeAddress: settings.address!,
            targetAddress: withdrawRequestAddress,
          });
        }),
        map(
          ([transaction]: [Transaction | null, TxCandidate, Error | null]) =>
            transaction!,
        ),
        first(),
      );
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [userNftAssets, isLoading]);

  return (
    <>
      {address !== undefined ? (
        <>
          <iframe
            frameBorder={0}
            className={styles.iframeStyle}
            src={`https://app-v2.teddyswap.org/byAddr/${address}`}
          />
        </>
      ) : (
        <>
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            Please connect your wallet to view your rewards.
          </Typography.Title>
        </>
      )}
    </>
  );
};
