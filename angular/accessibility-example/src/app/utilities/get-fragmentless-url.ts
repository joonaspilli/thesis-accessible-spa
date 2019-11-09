import { ActivatedRoute, Router } from '@angular/router';

export const getFragmentlessUrl = (
  router: Router,
  route: ActivatedRoute|null = router.routerState.root.firstChild
): string|undefined => {
  if (route) {
    const url = router.url;
    const fragment = route.snapshot.fragment;
    const cut = fragment ? -fragment.length - 1 : 0;
    return cut ? url.slice(0, cut) : url;
  }
};
