namespace CardanoBridge {
  import { Paging } from '@ergolabs/cardano-dex-sdk';
  import { HexString } from '@ergolabs/ergo-sdk';

  type EncodedTxOut = HexString;
  type EncodedBalance = HexString;
  type EncodedAddress = HexString;

  export interface ConnectorContextApi {
    getUtxos(
      amount?: CardanoWasm.Value,
      paginate?: Paging,
    ): Promise<EncodedTxOut[] | undefined>;
    getBalance(): Promise<EncodedBalance>;
    getUsedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
    getUnusedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
  }

  export interface ConnectorAPI {
    enable(): Promise<ConnectorContextApi>;
    isEnabled(): Promise<boolean>;
  }
}

declare let cardano: { [key: string]: CardanoBridge.ConnectorAPI };
