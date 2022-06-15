import { Dictionary } from '../../../common/utils/Dictionary';
import { Column } from './Column';
import { FilterState } from './FilterDescription';

export const filterItem = (
  item: unknown,
  column: Column<any>,
  columnNum: number,
  filtersState: Dictionary<FilterState<any>>,
): boolean => {
  const filterStateArray = Object.values(filtersState);

  if (!filterStateArray.length || !column.filter?.match) {
    return true;
  }

  return column.filter.match(filtersState[columnNum]?.value, item);
};
