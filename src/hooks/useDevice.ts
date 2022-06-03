import { size, Sizes } from '../common/constants/size';
import { useWindowSize } from './useWindowSize';

type ValBySizeT = <T>(s: T, m?: T, l?: T, xl?: T, xxl?: T) => T;

interface useDeviseRes extends Record<Sizes, boolean> {
  size: Sizes;
  valBySize: ValBySizeT;
}

const getSizeByWidth = (width: number): Sizes => {
  if (width <= size.m) return 's';
  if (width <= size.l) return 'm';
  if (width <= size.xl) return 'l';
  if (width <= size.xxl) return 'xl';
  return 'xxl';
};

const valBySizeFactory = (size: Sizes): ValBySizeT => {
  if (size === 'xxl') return (s, m?, l?, xl?, xxl?) => xxl ?? xl ?? l ?? m ?? s;
  if (size === 'xl') return (s, m?, l?, xl?) => xl ?? l ?? m ?? s;
  if (size === 'l') return (s, m?, l?) => l ?? m ?? s;
  if (size === 'm') return (s, m?) => m ?? s;
  if (size === 's') return (s) => s;
  return (s?) => s;
};

export const useDevice = (): useDeviseRes => {
  const { width } = useWindowSize();
  const size = getSizeByWidth(width);

  return {
    size,
    s: size === 's',
    m: size === 'm',
    l: size === 'l',
    xl: size === 'xl',
    xxl: size === 'xxl',
    valBySize: valBySizeFactory(size),
  };
};
