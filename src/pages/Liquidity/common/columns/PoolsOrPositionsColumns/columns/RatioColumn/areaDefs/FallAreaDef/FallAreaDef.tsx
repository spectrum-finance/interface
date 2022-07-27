import React, { FC, useEffect } from 'react';

import { AreaDef } from '../AreaDef/AreaDef';

export const FallAreaDef: FC<AreaDef> = ({ id, onAreaStylesChange }) => {
  useEffect(() => {
    onAreaStylesChange(['var(--ergo-error-color)', `url(#${id})`]);
  }, []);

  return (
    <linearGradient id={`${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="var(--ergo-error-color)" stopOpacity="0.5" />
      <stop offset="1" stopColor="var(--ergo-error-color)" stopOpacity="0" />
    </linearGradient>
  );
};
