import { applicationConfig } from '../../../../applicationConfig';
import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData.ts';

export interface DefaultTokenListItem {
  readonly policyId: string;
  readonly subject: string;
  readonly description: string;
  readonly url: string;
  readonly name: string;
  readonly ticker: string;
  readonly decimals: number;
  readonly _logo?: string;
  readonly logo?: string;
}

export const defaultTokenList$ = getDefaultTokenList<DefaultTokenListItem>(
  applicationConfig.networksSettings.cardano.defaultTokenListUrl,
  (item) => {
    return item.subject;
  },
  cardanoNetworkData.additionalTokenList,
);
