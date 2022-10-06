import { map, of, publishReplay, refCount } from 'rxjs';

import { settings$ } from '../../settings/settings';
import { ErgoPaySwapConfirmationModal } from './ErgoPaySwapConfirmationModal/ErgoPaySwapConfirmationModal';
import { WalletSwapConfirmationModal } from './WalletSwapConfirmationModal/WalletSwapConfirmationModal';

export const swapConfirmationModal$ = settings$.pipe(
  map((settings) =>
    settings.ergopay
      ? ErgoPaySwapConfirmationModal
      : WalletSwapConfirmationModal,
  ),
  publishReplay(1),
  refCount(),
);
