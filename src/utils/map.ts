import { TokenId } from '@ergolabs/ergo-sdk';

import { TOKEN_MAPPER } from '../mappers/tokenMapper';

export const getAssetNameByMappedId = (tokenId: TokenId): string | undefined =>
  TOKEN_MAPPER.get(tokenId);
