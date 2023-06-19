import { applicationConfig } from '../../../../applicationConfig';
import { getDefaultTokenList } from '../../../../common/services/DefaultTokenList';

export const defaultTokenList$ = getDefaultTokenList(
  applicationConfig.networksSettings.ergo.defaultTokenListUrl,
  'address',
);
