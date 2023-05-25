import { HexString, Prover, Value } from '@ergolabs/cardano-dex-sdk';
import { RawTx } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/tx';
import { TxOut } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { Address } from '../../../../../common/types';
import { Wallet } from '../../../../common/Wallet';

export enum CardanoNetwork {
  TESTNET,
  MAINNET,
}

export interface CardanoWalletContract extends Wallet, Prover {
  readonly testnetSwitchGuideUrl?: string;
  readonly connectWallet: () => Observable<boolean | ReactNode>;
  readonly getUsedAddresses: () => Observable<Address[]>;
  readonly getChangeAddress: () => Observable<Address>;
  readonly getAddresses: () => Observable<Address[]>;
  readonly getUnusedAddresses: () => Observable<Address[]>;
  readonly getBalance: () => Observable<[bigint, AssetInfo][]>;
  readonly getUtxos: (amount?: Value) => Observable<TxOut[]>;
  readonly getCollateral: (amount: bigint) => Observable<TxOut[]>;
  readonly submit: (tx: RawTx) => Observable<HexString>;
}
