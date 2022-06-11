import { Dictionary } from '../../../common/utils/Dictionary';
import { Column } from './Column';
import { FilterState } from './Filter';

export const filterItem = (
  item: unknown,
  column: Column<any>,
  columnNum: number,
  filtersState: Dictionary<FilterState<any>>,
): boolean => {
  const filterStateArray = Object.values(filtersState);

  if (!filterStateArray.length || !column.filterMatch) {
    return true;
  }

  return column.filterMatch(filtersState[columnNum]?.value, item);
};
