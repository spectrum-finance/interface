import { Currency } from '../models/Currency';
import { Position } from '../models/Position';

// Only for n2t
export const normalizeAvailableLp = (
  position: Position,
): [Currency, Currency, Currency] => {
  return [position.availableLp, position.availableX, position.availableY];
};
