import { AssetClass } from '@ergolabs/cardano-dex-sdk';
import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { Observable, of } from 'rxjs';

import { Dictionary } from '../../../../common/utils/Dictionary';
import { AssetInfo } from './AssetInfo';

export const assets: Dictionary<AssetInfo> = {
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

export const getAssetInfo = (
  a: AssetClass,
): Observable<AssetInfo | undefined> => of(assets[mkSubject(a)]);
