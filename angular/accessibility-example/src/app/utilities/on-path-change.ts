import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { getFragmentlessUrl } from './get-fragmentless-url';

export const onPathChange = (
  router: Router
): Observable<ActivatedRoute|null> => {
  return router.events.pipe(
    filter((event: Event) => event instanceof NavigationEnd),
    map(() => getFragmentlessUrl(router)),
    distinctUntilChanged(),
    map(() => router.routerState.root.firstChild)
  );
};
