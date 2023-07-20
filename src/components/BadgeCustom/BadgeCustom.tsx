import styled from 'styled-components';

interface BadgeCustomProps {
  isShow?: boolean;
  isAnimate?: boolean;
}
export const BadgeCustom = styled.div<BadgeCustomProps>`
  position: relative;
  &::after {
    display: ${(props) => (props.isShow ? 'block' : 'none')};
    content: '';
    position: absolute;
    top: -3px;
    right: -3px;

    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: var(--spectrum-warning-color);
  }
`;
