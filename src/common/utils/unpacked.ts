import { Observable } from 'rxjs';

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T extends Observable<infer U>
  ? U
  : T;
