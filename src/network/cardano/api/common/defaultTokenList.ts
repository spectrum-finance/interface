import { applicationConfig } from '../../../../applicationConfig';
import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';

export interface DefaultTokenListItem {
  readonly policyId: string;
  readonly subject: string;
  readonly description: string;
  readonly url: string;
  readonly name: string;
  readonly ticker: string;
  readonly decimals: number;
}

export const defaultTokenList$ = getDefaultTokenList<DefaultTokenListItem>(
  applicationConfig.networksSettings.cardano.defaultTokenListUrl,
  (item) => {
    return item.subject;
  },
);
