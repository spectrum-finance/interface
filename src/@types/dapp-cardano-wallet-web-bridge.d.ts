namespace CardanoBridge {
  import { HexString } from '@ergolabs/ergo-sdk';
  import { Paging } from '@spectrumlabs/cardano-dex-sdk';
  import {
    RawTx,
    RawUnsignedTx,
  } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/tx';

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
    getCollateral(params?: {
      amount?: EncodedAmount;
    }): Promise<EncodedTxOut[] | undefined>;
    experimental: {
      getCollateral(params: {
        amount?: EncodedAmount;
      }): Promise<EncodedTxOut[] | undefined>;
    };
    getChangeAddress(): Promise<EncodedAddress>;
    getBalance(): Promise<EncodedBalance>;
    getUsedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
    getUnusedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
    signTx(tx: RawUnsignedTx, partialSign: boolean = false): Promise<RawTx>;
    getNetworkId(): Promise<number>;
    submitTx(tx: RawTx): Promise<TxId>;
  }

  export interface ConnectorAPI {
    name?: string;
    enable(): Promise<ConnectorContextApi>;
    isEnabled(): Promise<boolean>;
    experimental?: any;
  }
}

declare let cardano: { [key: string]: CardanoBridge.ConnectorAPI };

interface Window {
  initCardanoDAppConnectorBridge: (
    callback: (connector: CardanoBridge.ConnectorAPI) => void,
  ) => void;
}
