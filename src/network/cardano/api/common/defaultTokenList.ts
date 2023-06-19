import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';

import { applicationConfig } from '../../../../applicationConfig';
import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';

export interface DefaultTokenListItem {
  readonly policyId: string;
  readonly subject: string;
  readonly description: string;
  readonly name: string;
  readonly ticker: string;
  readonly decimals: number;
}

export const defaultTokenList$ = getDefaultTokenList<DefaultTokenListItem>(
  applicationConfig.networksSettings.cardano_mainnet.defaultTokenListUrl,
  (item) => {
    return item.subject;
  },
);
