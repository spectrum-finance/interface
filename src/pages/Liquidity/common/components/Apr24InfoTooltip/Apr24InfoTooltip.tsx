import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';

import { InfoTooltip } from '../../../../../components/InfoTooltip/InfoTooltip.tsx';

interface Apr24InfoTooltipProps {
  readonly children: ReactNode | ReactNode[] | string;
}

export const Apr24InfoTooltip: FC<Apr24InfoTooltipProps> = ({ children }) => {
  return (
    <InfoTooltip
      width={300}
      placement="top"
      content={
        <>
          <Trans>
            A rough estimate based on the trading volume in a pool for the last
            24 hours. May not correspond to actual gains or losses.
          </Trans>
        </>
      }
    >
      {children}
    </InfoTooltip>
  );
};
