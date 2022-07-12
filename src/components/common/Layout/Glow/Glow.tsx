import styled from 'styled-components';

export const Glow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;

  &::after {
    position: absolute;
    z-index: -1;
    top: -778px;
    left: calc(50% - 1556px / 2);
    width: 1556px;
    height: 1556px;
    background: var(--ergo-glow-gradient);
    border-radius: 50%;
    content: '';
    filter: blur(429.241px);
  }
`;
