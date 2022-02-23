import { Address } from '@ergolabs/ergo-sdk';
import { from, map, Observable, zip } from 'rxjs';

const getUsedAddresses = (): Observable<Address[]> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => context.get_used_addresses()),
  );

const getUnusedAddresses = (): Observable<Address[]> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => context.get_unused_addresses()),
  );

export const getAddresses = (): Observable<Address[]> =>
  zip(getUsedAddresses(), getUnusedAddresses()).pipe(
    map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  );
