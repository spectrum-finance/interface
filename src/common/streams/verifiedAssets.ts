import axios from 'axios';
import { from, map } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';

export const verifiedAssets$ = from(
  axios.get(
    `${applicationConfig.networksSettings.ergo.metadataUrl}/verifiedAssets.json`,
  ),
).pipe(map((res) => res.data));
