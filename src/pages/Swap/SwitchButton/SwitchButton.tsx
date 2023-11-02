import { Button, ButtonProps } from '@ergolabs/ui-kit';
import styled from 'styled-components';

interface SwitchButtonProps extends ButtonProps {
  isSwitch: boolean;
}

const _SwitchButton = (props: SwitchButtonProps) => {
  const { className, isSwitch, ...rest } = props;
  return (
    <div className={`${className} ${isSwitch ? 'switch-btn' : ''}`}>
      <Button {...rest} />
    </div>
  );
};

export const SwitchButton = styled(_SwitchButton)`
  position: relative;
  color: red;

  button {
    position: absolute;
    z-index: 1;
    top: calc(50% - 16px);
    left: calc(50% - 16px);
  }
  &.switch-btn {
    button {
      transform: rotate(-180deg);
    }
  }
`;
