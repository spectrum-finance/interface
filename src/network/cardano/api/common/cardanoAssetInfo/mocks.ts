import { Subject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/types';
import { HexString } from '@ergolabs/ergo-sdk';

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
  '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e42':
    {
      subject:
        '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e42',
      policy: '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'ergoTestTokenB',
      },
      ticker: {
        value: 'ergoTestTokenB',
      },
      description: {
        value: 'ergoTestTokenB',
      },
      decimals: {
        value: 2,
      },
    },
  '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e41':
    {
      subject:
        '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e41',
      policy: '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'ergoTestTokenA',
      },
      ticker: {
        value: 'ergoTestTokenA',
      },
      description: {
        value: 'ergoTestTokenA',
      },
      decimals: {
        value: 6,
      },
    },
  '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e4c50':
    {
      subject:
        '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da6572676f54657374546f6b656e4c50',
      policy: '805fe1efcdea11f1e959eff4f422f118aa76dca2d0d797d184e487da',
      url: {
        value: '',
      },
      logo: {
        value: '',
      },
      name: {
        value: 'ergoTestTokenLP',
      },
      ticker: {
        value: 'ergoTestTokenLP',
      },
      description: {
        value: 'ergoTestTokenLP',
      },
      decimals: {
        value: 0,
      },
    },
};
