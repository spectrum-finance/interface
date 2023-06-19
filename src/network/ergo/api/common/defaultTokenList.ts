import { applicationConfig } from '../../../../applicationConfig';
import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';
import { uint } from '../../../../common/types';

export interface DefaultTokenListItem {
  readonly address: string;
  readonly decimals: uint;
  readonly name: string;
  readonly ticker: string;
  readonly logoURI?: string;
}

export const defaultTokenList$ = getDefaultTokenList<DefaultTokenListItem>(
  applicationConfig.networksSettings.ergo.defaultTokenListUrl,
  (item) => item.address,
);
