import { ActivatedRoute } from '@angular/router';

/**
 * Solve current ActivatedRoute when outside a RouterOutlet by traversing the
 * router state tree.
 */
export const solveActivatedRoute = (route: ActivatedRoute): ActivatedRoute => {
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
};
