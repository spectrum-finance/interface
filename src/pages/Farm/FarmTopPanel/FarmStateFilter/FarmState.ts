import { t } from '@lingui/macro';

import { LmPoolStatus } from '../../../../common/models/LmPool';

export const FarmStateCaptions = {
  [LmPoolStatus.All]: t`All`,
  [LmPoolStatus.Live]: t`Live`,
  [LmPoolStatus.Scheduled]: t`Scheduled`,
  [LmPoolStatus.Finished]: t`Finished`,
};
