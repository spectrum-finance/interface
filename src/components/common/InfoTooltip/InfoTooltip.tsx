import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@geist-ui/react';

interface Props {
  text: ReactNode;
  children?: React.ReactNode;
}
const InfoTooltip = ({ text, children }: Props): JSX.Element => {
  return (
    <Tooltip text={text}>
      {children}
      <FontAwesomeIcon icon={faQuestionCircle} />
    </Tooltip>
  );
};

export default InfoTooltip;
