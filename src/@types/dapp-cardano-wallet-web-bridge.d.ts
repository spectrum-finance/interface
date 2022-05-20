namespace CardanoBridge {
  import {
    RawTx,
    RawUnsignedTx,
  } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/tx';
  import { Paging } from '@ergolabs/cardano-dex-sdk';
  import { HexString } from '@ergolabs/ergo-sdk';

  type EncodedTxOut = HexString;
  type EncodedBalance = HexString;
  type EncodedAddress = HexString;
  type EncodedAmount = HexString;
  type TxId = HexString;

  export interface ConnectorContextApi {
    getUtxos(
      amount?: EncodedAmount,
      paginate?: Paging,
    ): Promise<EncodedTxOut[] | undefined>;
    getChangeAddress(): Promise<EncodedAddress>;
    getBalance(): Promise<EncodedBalance>;
    getUsedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
    getUnusedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
    signTx(tx: RawUnsignedTx, partialSign: boolean = false): Promise<RawTx>;
    getNetworkId(): Promise<number>;
    submitTx(tx: RawTx): Promise<TxId>;
  }

  export interface ConnectorAPI {
    enable(): Promise<ConnectorContextApi>;
    isEnabled(): Promise<boolean>;
  }
}

declare let cardano: { [key: string]: CardanoBridge.ConnectorAPI };
