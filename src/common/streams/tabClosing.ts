import { fromEvent } from 'rxjs';

export const tabClosing$ = fromEvent(window, 'beforeunload');
