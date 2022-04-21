import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';
import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, Observable, switchMap } from 'rxjs';

import { UI_REWARD_ADDRESS } from '../../../../common/constants/settings';
import { TxId } from '../../../../common/types';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { selectedWallet$ } from '../wallet/wallet';
import { proverMediator } from './common/proverMediator';
