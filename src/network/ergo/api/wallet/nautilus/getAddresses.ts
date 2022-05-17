import { Address } from '@ergolabs/ergo-sdk';
import { from, map, Observable, zip } from 'rxjs';

export const getUsedAddresses = (): Observable<Address[]> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => context.get_used_addresses()),
  );

export const getUnusedAddresses = (): Observable<Address[]> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => context.get_unused_addresses()),
  );

export const getAddresses = (): Observable<Address[]> =>
  zip(getUsedAddresses(), getUnusedAddresses()).pipe(
    map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  );

export const getChangeAddress = (): Observable<Address> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => context.get_change_address()),
  );
