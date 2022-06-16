import { Observable } from 'rxjs';

export type Initializer = (...args: any[]) => Observable<true>;
