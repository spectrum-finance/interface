import { t } from '@lingui/macro';

import { OperationStatus } from '../../../../common/models/OperationV2';
import { FilterRenderer } from '../../../TableView/common/FilterDescription';
import {
  MultiselectFilter,
  MultiselectFilterItem,
} from '../../../TableView/filters/MultiselectFilter/MultiselectFilter';

const statusesFilterItems: MultiselectFilterItem<OperationStatus>[] = [
  { value: OperationStatus.Evaluated, caption: t`Executed` },
  { value: OperationStatus.Pending, caption: t`Pending` },
  { value: OperationStatus.Refunded, caption: t`Refunded` },
  { value: OperationStatus.NeedRefund, caption: t`Need refund` },
];
export const statusFilterRender: FilterRenderer<OperationStatus> = ({
  value,
  onChange,
}) => (
  <MultiselectFilter
    items={statusesFilterItems}
    value={value}
    onChange={onChange}
  />
);
