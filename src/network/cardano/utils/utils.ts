import { Address, TxId } from '@ergolabs/ergo-sdk';
import { first } from 'rxjs';

import { AssetInfo } from '../../../common/models/AssetInfo';
import { networkContext$ } from '../api/networkContext/networkContext';
import { cardanoNetworkData } from './cardanoNetworkData';

export const exploreTx = (txId: TxId): unknown =>
  window.open(
    `${cardanoNetworkData.explorerUrl}/${
      cardanoNetworkData.explorerUrl.includes('cardanoscan')
        ? 'transaction'
        : 'tx'
    }/${txId}`,
    '_blank',
  );

export const exploreAddress = (address: Address): unknown =>
  window.open(`${cardanoNetworkData.explorerUrl}/address/${address}`, '_blank');

export const exploreLastBlock = (): unknown =>
  networkContext$.pipe(first()).subscribe((ctx) => {
    window.open(
      `${cardanoNetworkData.explorerUrl}/block/${ctx.lastBlockId}`,
      '_blank',
    );
  });

export const exploreToken = (asset: AssetInfo): unknown =>
  window.open(`${cardanoNetworkData.explorerUrl}/token/${asset.id}`, '_blank');
