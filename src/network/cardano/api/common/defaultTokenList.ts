import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';

export interface DefaultTokenListItem {
  readonly policyId: string;
  readonly subject: string;
  readonly description: string;
  readonly name: string;
  readonly ticker: string;
  readonly decimals: number;
}

export const defaultTokenList$ = getDefaultTokenList<DefaultTokenListItem>(
  cardanoNetworkData.defaultTokenListUrl,
  (item) => {
    return item.subject;
  },
);
