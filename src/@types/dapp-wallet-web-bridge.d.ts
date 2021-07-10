namespace ErgoBridge {
  type Address = import('ergo-dex-sdk/build/module/ergo').Address;
  type BoxId = import('ergo-dex-sdk/build/module/ergo').BoxId;
  type ErgoBox = import('ergo-dex-sdk/build/module/ergo').ErgoBox;
  type ErgoTx = import('ergo-dex-sdk/build/module/ergo').ErgoTx;
  type Input = import('ergo-dex-sdk/build/module/ergo').Input;
  type NErg = import('ergo-dex-sdk/build/module/ergo').NErg;
  type TokenId = import('ergo-dex-sdk/build/module/ergo').TokenId;
  type TxId = import('ergo-dex-sdk/build/module/ergo').TxId;
  type UnsignedErgoTx = import('ergo-dex-sdk/build/module/ergo').UnsignedErgoTx;

  type Paging = import('ergo-dex-sdk').Paging;

  // see https://github.com/Emurgo/Emurgo-Research/blob/master/ergo/EIP-0012.md
  export interface ErgoAPI {
    request_read_access: () => Promise<boolean>;

    check_read_access: () => boolean;

    get_utxos: (
      amount?: NErg,
      token_id?: TokenId,
      paginate?: Paging,
    ) => Promise<ErgoBox[] | undefined>;

    get_balance: (token_id: TokenId) => Promise<string>;

    get_used_addresses: (paginate?: Paging) => Promise<Address[]>;

    get_unused_addresses: () => Address[];

    sign_tx: (tx: UnsignedErgoTx) => Promise<ErgoTx>;

    sign_tx_input: (tx: UnsignedErgoTx, index: number) => Promise<Input>;

    sign_data: (addr: Address, message: string) => Promise<string>;

    submit_tx: (tx: ErgoTx) => TxId;

    add_external_box: (box_id: BoxId) => boolean;
  }
}

declare let ergo: ErgoBridge.ErgoAPI;
