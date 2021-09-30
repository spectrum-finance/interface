import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@geist-ui/react';
import React, { ReactNode } from 'react';

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
