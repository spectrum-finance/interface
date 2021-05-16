/**
 * Took from yoroi-frontend/packages/yoroi-ergo-connector/src/inject.js
 *
class ErgoAPI {
  get_balance(token_id = 'ERG') {
    return this._ergo_rpc_call("get_balance", [token_id]);
  }

  get_utxos(amount = undefined, token_id = 'ERG', paginate = undefined) {
    return this._ergo_rpc_call("get_utxos", [amount, token_id, paginate]);
  }

  get_used_addresses(paginate = undefined) {
    return this._ergo_rpc_call("get_used_addresses", [paginate]);
  }

  get_unused_addresses() {
    return this._ergo_rpc_call("get_unused_addresses", []);
  }

  get_change_address() {
    return this._ergo_rpc_call("get_change_address", []);
  }

  sign_tx(tx) {
    return this._ergo_rpc_call("sign_tx", [tx]);
  }

  sign_tx_input(tx, index) {
    return this._ergo_rpc_call("sign_tx_input", [tx, index]);
  }

  // This is unsupported by current version of Yoroi
  // and the details of it are not finalized yet in the EIP-012
  // dApp bridge spec.
  // sign_data(addr, message) {
  //     return this._ergo_rpc_call("sign_data", [addr, message]);
  // }

  submit_tx(tx) {
    return this._ergo_rpc_call("submit_tx", [tx]);
  }

  _ergo_rpc_call(func, params) {
    return new Promise(function(resolve, reject) {
      window.postMessage({
        type: "connector_rpc_request",
        uid: ergoRpcUid,
        function: func,
        params: params
      }, location.origin);
      console.log("ergoRpcUid = " + ergoRpcUid);
      ergoRpcResolver.set(ergoRpcUid, { resolve: resolve, reject: reject });
      ergoRpcUid += 1;
    });
  }
}
 */

type token = 'ERG' | string;
type Pagination = any;

interface ErgoAPI {
  get_balance(token_id: token = 'ERG'): Promise<string>;

  get_utxos(
    amount: string = undefined,
    token_id: token = 'ERG',
    paginate?: Pagination,
  ): Promise<any>;

  get_used_addresses(paginate?: Pagination): Promise<any>;

  get_unused_addresses(): Promise<string>;

  get_change_address(): Promise<string>;

  sign_tx(tx: any): Promise<any>;

  sign_tx_input(tx: any, index: any): Promise<any>;

  // This is unsupported by current version of Yoroi
  // and the details of it are not finalized yet in the EIP-012
  // dApp bridge spec.
  // sign_data(addr, message) {
  //     return this._ergo_rpc_call("sign_data", [addr, message]);
  // }

  submit_tx(tx: any): Promise<any>;
}

interface Window {
  ergo_request_read_access: () => Promise<boolean>;
  ergo_check_read_access: () => Promise<boolean>;

  ergo: ErgoAPI;
}
