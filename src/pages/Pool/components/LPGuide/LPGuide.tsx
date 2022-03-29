import { t } from '@lingui/macro';
import React from 'react';

import { GuideBanner } from '../../../../components/GuideBanner/GuideBanner';

const LPGuide = (): JSX.Element => {
  return (
    <GuideBanner
      title={t`Become a liquidity provider`}
      subtitle={t`Check out our guides how to become a liquidity provider`}
      href="#"
    />
  );
};

export { LPGuide };
