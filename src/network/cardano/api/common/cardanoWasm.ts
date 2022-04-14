import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { from, publishReplay, refCount } from 'rxjs';

export const cardanoWasm$ = from(RustModule.load()).pipe(
  publishReplay(1),
  refCount(),
);
