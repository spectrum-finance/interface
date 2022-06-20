import { size as SIZE, Sizes } from '../common/constants/size';
import { useWindowSize } from './useWindowSize';

type ValBySizeT = <T>(s: T, m?: T, l?: T, xl?: T, xxl?: T) => T;

interface useDeviseRes extends Record<Sizes, boolean> {
  size: Sizes;
  valBySize: ValBySizeT;
  moreThan: (s: Sizes) => boolean;
  lessThan: (s: Sizes) => boolean;
}

const getSizeByWidth = (width: number): Sizes => {
  if (width <= SIZE.m) return 's';
  if (width <= SIZE.l) return 'm';
  if (width <= SIZE.xl) return 'l';
  if (width <= SIZE.xxl) return 'xl';
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
    moreThan: (size) => SIZE[size] < width,
    lessThan: (size) => SIZE[size] >= width,
  };
};
