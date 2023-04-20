import { publishReplay, refCount, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$, useSettings } from '../settings';
import {
  maxExFee$ as nativeMaxExFee$,
  minExFee$ as nativeMinExFee$,
  useMaxExFee as useNativeMaxExFee,
  useMinExFee as useNativeMinExFee,
} from './nativeExecutionFee';
import {
  maxExFee$ as spfMaxExFee$,
  minExFee$ as spfMinExFee$,
  useMaxExFee as useSpfMaxExFee,
  useMinExFee as useSpfMinExFee,
} from './spfExecutionFee';

export const minExFee$ = settings$.pipe(
  switchMap((settings) =>
    settings.executionFeeAsset?.id === feeAsset.id
      ? spfMinExFee$
      : nativeMinExFee$,
  ),
  publishReplay(1),
  refCount(),
);

export const maxExFee$ = settings$.pipe(
  switchMap((settings) =>
    settings.executionFeeAsset?.id === feeAsset.id
      ? spfMaxExFee$
      : nativeMaxExFee$,
  ),
  publishReplay(1),
  refCount(),
);

export const useMinExFee = (): Currency => {
  const [{ executionFeeAsset }] = useSettings();
  const spfMinExFee = useSpfMinExFee();
  const nativeMinExFee = useNativeMinExFee();

  return executionFeeAsset?.id === feeAsset.id ? spfMinExFee : nativeMinExFee;
};

export const useMaxExFee = (): Currency => {
  const [{ executionFeeAsset }] = useSettings();
  const spfMaxExFee = useSpfMaxExFee();
  const nativeMaxExFee = useNativeMaxExFee();

  return executionFeeAsset?.id === feeAsset.id ? spfMaxExFee : nativeMaxExFee;
};
