import { Address, TxId } from '@ergolabs/ergo-sdk';
import { first } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { networkContext$ } from '../api/networkContext/networkContext';

export const exploreTx = (txId: TxId): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/tx/${txId}`,
    '_blank',
  );

export const exploreAddress = (address: Address): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/address/${address}`,
    '_blank',
  );

export const exploreLastBlock = (): unknown =>
  networkContext$.pipe(first()).subscribe((ctx) => {
    window.open(
      `${applicationConfig.networksSettings.cardano.explorerUrl}/block/${ctx.blockHash}`,
      '_blank',
    );
  });

export const exploreToken = (asset: AssetInfo): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/token/${asset.id}`,
    '_blank',
  );
