import { Address, TxId } from '@ergolabs/ergo-sdk';

import { applicationConfig } from '../../../applicationConfig';
import { AssetInfo } from '../../../common/models/AssetInfo';

export const exploreTx = (txId: TxId): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/transaction/${txId}`,
    '_blank',
  );

export const exploreAddress = (address: Address): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/address/${address}`,
    '_blank',
  );

export const exploreLastBlock = (lastBlockId: number): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/block/${lastBlockId}`,
    '_blank',
  );

export const exploreToken = (asset: AssetInfo): unknown =>
  window.open(
    `${applicationConfig.networksSettings.cardano.explorerUrl}/token/${asset.id}`,
    '_blank',
  );
