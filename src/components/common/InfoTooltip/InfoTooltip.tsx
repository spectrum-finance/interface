import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@geist-ui/react';

const InfoTooltip = ({ text }: { text: ReactNode }): JSX.Element => {
  return (
    <Tooltip text={text}>
      <FontAwesomeIcon icon={faQuestionCircle} />
    </Tooltip>
  );
};

export default InfoTooltip;
