namespace ErgoBridge {
  type Address = import('@ergolabs/ergo-sdk').Address;
  type BoxId = import('@ergolabs/ergo-sdk').BoxId;
  type ErgoBoxProxy = import('@ergolabs/ergo-sdk').ErgoBoxProxy;
  type ErgoTxProxy = import('@ergolabs/ergo-sdk').ErgoTxProxy;
  type UnsignedErgoTxProxy = import('@ergolabs/ergo-sdk').UnsignedErgoTxProxy;
  type Input = import('@ergolabs/ergo-sdk').Input;
  type NErg = import('@ergolabs/ergo-sdk').NErg;
  type TokenId = import('@ergolabs/ergo-sdk').TokenId;
  type TxId = import('@ergolabs/ergo-sdk').TxId;

  type Paging = import('@ergolabs/ergo-sdk').Paging;

  // See https://github.com/Emurgo/Emurgo-Research/blob/master/ergo/EIP-0012.md
  export interface ErgoAPI {
    request_read_access: () => Promise<boolean>;

    check_read_access: () => boolean;

    get_utxos: (
      amount?: NErg,
      token_id?: TokenId,
      paginate?: Paging,
    ) => Promise<ErgoBoxProxy[] | undefined>;

    get_balance: (token_id: TokenId) => Promise<string>;

    get_used_addresses: (paginate?: Paging) => Promise<Address[]>;

    get_change_address: () => Promise<Address>;

    get_unused_addresses: () => Promise<Address[]>;

    sign_tx: (tx: UnsignedErgoTxProxy) => Promise<ErgoTxProxy>;

    sign_tx_input: (tx: UnsignedErgoTxProxy, index: number) => Promise<Input>;

    sign_data: (addr: Address, message: string) => Promise<string>;

    submit_tx: (tx: ErgoTxProxy) => Promise<TxId>;

    add_external_box: (box_id: BoxId) => boolean;
  }
}

declare let ergoConnector: {
  nautilus: {
    connect: (params: { createErgoObject: boolean }) => Promise<boolean>;
    getContext: () => Promise<ErgoBridge.ErgoAPI>;
  };
};
declare let ergo: ErgoBridge.ErgoAPI;
