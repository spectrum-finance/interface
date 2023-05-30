import {
  CardanoWasm,
  RustModule,
} from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { from, Observable, publishReplay, refCount } from 'rxjs';

export const cardanoWasm$: Observable<CardanoWasm> = from(
  RustModule.load(),
).pipe(publishReplay(1), refCount());
