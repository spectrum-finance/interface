import {
  decodeAddr,
  decodeWasmUtxo,
  decodeWasmValue,
  HexString,
  Prover,
  Value,
} from '@spectrumlabs/cardano-dex-sdk';
import { RawTx } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/tx';
import { TxOut } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import uniq from 'lodash/uniq';

import { Address } from '../../../../../common/types';
import { Unpacked } from '../../../../../common/utils/unpacked';
import { selectUtxos } from './BoxSelector';
import ConnectorContextApi = CardanoBridge.ConnectorContextApi;

const isConnectorContext = (
  contextOrError: ConnectorContextApi | Error,
): contextOrError is ConnectorContextApi => {
  return !!(contextOrError as ConnectorContextApi).signTx;
};

// Todo: Extract to sdk
export interface Submitter {
  readonly submit: (tx: RawTx) => Promise<HexString>;
}

export interface WalletData {
  readonly connector: CardanoBridge.ConnectorAPI;
  readonly id: string;

  readonly assertContext: <
    T extends (context: CardanoBridge.ConnectorContextApi) => any,
  >(
    callback: T,
  ) => Promise<Unpacked<ReturnType<T>>>;
  readonly resetContext: () => void;

  readonly getUsedAddresses: () => Promise<Address[]>;
  readonly getUnusedAddresses: () => Promise<Address[]>;
  readonly getAddresses: () => Promise<Address[]>;
  readonly getChangeAddress: () => Promise<Address>;

  readonly getBalance: () => Promise<Value>;
  readonly getUtxos: (
    amount?: Value,
    excludedInputs?: TxOut[],
  ) => Promise<TxOut[]>;
  readonly getCollateral: (amount?: bigint) => Promise<TxOut[]>;
}

export type Wallet<T extends object = object> = Prover &
  Submitter &
  WalletData &
  T;

export interface WalletExtendParams {
  readonly id: string;
  readonly getConnector: () => CardanoBridge.ConnectorAPI;
  readonly getUsedAddresses?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address[]>;
  readonly getUnusedAddresses?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address[]>;
  readonly getChangeAddress?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Address>;
  readonly getBalance?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<Value>;
  readonly getUtxos?: (
    ctx: CardanoBridge.ConnectorContextApi,
  ) => Promise<TxOut[]>;
  readonly getCollateral?: (
    ctx: CardanoBridge.ConnectorContextApi,
    amount?: bigint,
  ) => Promise<TxOut[]>;
  readonly submit?: (
    ctx: CardanoBridge.ConnectorContextApi,
    tx: RawTx,
  ) => Promise<HexString>;
  readonly sign?: (
    ctx: CardanoBridge.ConnectorContextApi,
    tx: RawTx,
    partialSign?: boolean,
  ) => Promise<HexString>;
}

export const createWallet = <
  AdditionalData extends object | undefined = undefined,
>(
  params: AdditionalData extends object
    ? WalletExtendParams & AdditionalData
    : WalletExtendParams,
): AdditionalData extends object ? Wallet<AdditionalData> : Wallet => {
  let connector: CardanoBridge.ConnectorAPI;
  let contextPromise: Promise<CardanoBridge.ConnectorContextApi> | undefined;

  const getConnector = () => {
    if (!connector) {
      connector = params.getConnector();
    }
    return connector;
  };

  const resetContext = () => {
    contextPromise = undefined;
  };

  //@ts-ignore
  const assertContext = <
    T extends (context: CardanoBridge.ConnectorContextApi) => any,
  >(
    callback: T,
  ): Promise<Unpacked<ReturnType<T>>> => {
    const connector = getConnector();

    if (!connector) {
      return Promise.reject(
        new Error(`connector with id ${params.id} not found`),
      );
    }
    if (!contextPromise) {
      contextPromise = connector.enable();
    }
    return contextPromise
      .catch((error) => error)
      .then((contextOrError: ConnectorContextApi | Error) => {
        if (isConnectorContext(contextOrError)) {
          return callback(contextOrError);
        } else {
          contextPromise = undefined;
          throw contextOrError;
        }
      });
  };

  const getUsedAddresses = (): Promise<Address[]> => {
    console.log(
      RustModule.CardanoWasm.PlutusData.from_hex(
        'd8799fd8799f4040ffd8799f581c533bb94a8850ee3ccbe483106489399112b74c905342cb1792a797a044494e4459ffd8799f581cd0861c6a8e913001a9ceaca2c8f3d403c7ed541e27fab570c0d17a324c494e44495f4144415f4e4654ff1903e51b00355554f1c7a8f41b002386f26fc10000581cc06d3c6c1fd24aab874cfb35a7fe5d090a501e4df0d9a58d00fd5678d8799f581c63481073ae1ea98b21c55b4ea2ab133ad85288c67b51c06edea79459ff1a000f42401a00124bc1ff',
      ).to_json(1),
    );

    return assertContext((context) => {
      if (params?.getUsedAddresses) {
        return params.getUsedAddresses(context);
      }
      return context.getUsedAddresses();
    }).then((encodedAddrs) =>
      encodedAddrs.map((item) => decodeAddr(item, RustModule.CardanoWasm)),
    );
  };

  const getUnusedAddresses = (): Promise<Address[]> => {
    return assertContext((context) => {
      if (params?.getUnusedAddresses) {
        return params.getUnusedAddresses(context);
      }
      return context
        .getUnusedAddresses()
        .then((encodedAddrs) =>
          encodedAddrs.map((item) => decodeAddr(item, RustModule.CardanoWasm)),
        );
    });
  };

  const getChangeAddress = (): Promise<Address> => {
    return assertContext((context) => {
      if (params?.getChangeAddress) {
        return params.getChangeAddress(context);
      }
      return context
        .getChangeAddress()
        .then((encodedAddr) => decodeAddr(encodedAddr, RustModule.CardanoWasm));
    });
  };

  const getAddresses = (): Promise<Address[]> => {
    return Promise.all([getUnusedAddresses(), getUsedAddresses()])
      .then(([unusedAddresses, usedAddresses]) => [
        ...unusedAddresses,
        ...usedAddresses,
      ])
      .then(uniq);
  };

  const getBalance = (): Promise<Value> => {
    return assertContext((context) => {
      if (params?.getBalance) {
        return params.getBalance(context);
      }
      return context
        .getBalance()
        .then((rawBalance) =>
          decodeWasmValue(rawBalance, RustModule.CardanoWasm),
        );
    });
  };

  const getUtxos = (
    amount?: Value,
    excludedInputs?: TxOut[],
  ): Promise<TxOut[]> => {
    return assertContext((context) => {
      if (params?.getUtxos) {
        return params.getUtxos(context);
      }
      return context
        .getUtxos()
        .then(
          (rawUtxos) =>
            rawUtxos?.map((hex) =>
              decodeWasmUtxo(hex, RustModule.CardanoWasm),
            ) || [],
        );
    }).then((utxos) =>
      amount ? selectUtxos(utxos, amount, excludedInputs) : utxos,
    );
  };

  const getCollateral = (amount?: bigint): Promise<TxOut[]> => {
    return assertContext((context) => {
      const argument = amount
        ? ({
            amount: RustModule._wasm?.BigNum.from_str(
              amount.toString(),
            ).to_hex(),
          } as any)
        : undefined;

      if (params?.getCollateral) {
        return params.getCollateral(context, amount);
      }

      if (!context.getCollateral && !context.experimental.getCollateral) {
        return [];
      }

      const collateralPromise = context.getCollateral
        ? context.getCollateral(argument)
        : context.experimental.getCollateral(argument);

      return collateralPromise.then(
        (rawUtxos) =>
          rawUtxos?.map((hex) => decodeWasmUtxo(hex, RustModule.CardanoWasm)) ||
          [],
      );
    });
  };

  const submit = (tx: RawTx): Promise<HexString> => {
    console.log(tx, RustModule.CardanoWasm.Transaction.from_hex(tx));
    return assertContext((context) => {
      console.log('signed: ', RustModule.CardanoWasm.Transaction.from_hex(tx));
      if (params?.submit) {
        return params.submit(context, tx);
      }
      return context.submitTx(tx);
    });
  };

  const sign = (tx: RawTx, partialSign?: boolean): Promise<HexString> => {
    return assertContext((context) => {
      console.log(
        'notSigned:',
        RustModule.CardanoWasm.Transaction.from_hex(tx),
      );
      if (params?.sign) {
        return params.sign(context, tx, partialSign);
      }
      return context.signTx(tx, partialSign).then((wits) => {
        console.log(
          'Wits',
          RustModule.CardanoWasm.TransactionWitnessSet.from_hex(wits),
        );
        return wits;
      });
    });
  };

  return {
    ...(params as any),

    id: params.id,
    get connector() {
      return getConnector();
    },
    assertContext,
    resetContext,

    getAddresses,
    getUnusedAddresses,
    getUsedAddresses,
    getChangeAddress,

    getBalance,
    getUtxos,
    getCollateral,

    submit,
    sign,
  };
};
