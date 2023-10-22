import { HexString } from '@ergolabs/ergo-sdk';
import { Subject } from '@teddyswap/cardano-dex-sdk/build/main/cardano/types';

import { Dictionary } from '../../../../../common/utils/Dictionary';

interface CardanoAssetInfoItem<T> {
  readonly value: T;
}

export interface CardanoAssetInfo {
  readonly subject: Subject;
  readonly policy: HexString;
  readonly url: CardanoAssetInfoItem<string>;
  readonly name: CardanoAssetInfoItem<string>;
  readonly ticker: CardanoAssetInfoItem<string>;
  readonly logo: CardanoAssetInfoItem<string>;
  readonly description: CardanoAssetInfoItem<string>;
  readonly decimals: CardanoAssetInfoItem<number>;
}

export const assets: Dictionary<CardanoAssetInfo> = {
  '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f62':
    {
      subject:
        '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f62',
      policy: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'new_spectrum_token_b',
      },
      ticker: {
        value: 'new_spectrum_token_b',
      },
      description: {
        value: 'new_spectrum_token_b',
      },
      decimals: {
        value: 6,
      },
    },
  '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f61':
    {
      subject:
        '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f61',
      policy: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'new_spectrum_token_a',
      },
      ticker: {
        value: 'new_spectrum_token_a',
      },
      description: {
        value: 'new_spectrum_token_a',
      },
      decimals: {
        value: 6,
      },
    },
  '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f6c70':
    {
      subject:
        '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d34046e65775f737065637472756d5f746f6b656e5f6c70',
      policy: '065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'new_spectrum_token_lp',
      },
      ticker: {
        value: 'new_spectrum_token_lp',
      },
      description: {
        value: 'ergoTestTokenLP',
      },
      decimals: {
        value: 0,
      },
    },
};
