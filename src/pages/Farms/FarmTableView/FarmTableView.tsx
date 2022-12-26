import { useDevice } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Farm } from '../../../common/models/Farm';
import { Position } from '../../../common/models/Position';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { FarmTableViewDesktop } from './FarmTableViewDesktop';
import { FarmTableViewLaptop } from './FarmTableViewLaptop';
import { FarmTableViewMobile } from './FarmTableViewMobile';
import { FarmTableViewTablet } from './FarmTableViewTablet';

export interface FarmTableViewProps<T extends Farm | Position> {
  readonly items: T[];
  // readonly poolMapper: (item: T) => AmmPool;
  readonly loading?: boolean;
  readonly expandComponent: FC<ExpandComponentProps<T>>;
  readonly className?: string;
}

export const FarmTableView: FC<FarmTableViewProps<any>> = ({
  items,
  expandComponent,
  // poolMapper,
  loading,
  className,
}) => {
  const { valBySize, moreThan, l, m, s } = useDevice();

  // if (moreThan('xl')) {
  //   return (
  //     <FarmTableViewDesktop
  //       items={items}
  //       loading={loading}
  //       expandComponent={expandComponent}
  //     />
  //   );
  // }

  return (
    <FarmTableViewDesktop
      items={items}
      loading={loading}
      expandComponent={expandComponent}
    />
  );

  if (l) {
    return (
      <FarmTableViewLaptop
        items={items}
        loading={loading}
        expandComponent={expandComponent}
      />
    );
  }

  if (m) {
    return (
      <FarmTableViewTablet
        items={items}
        loading={loading}
        expandComponent={expandComponent}
      />
    );
  }

  return (
    <FarmTableViewMobile
      items={items}
      loading={loading}
      expandComponent={expandComponent}
    />
  );
};
