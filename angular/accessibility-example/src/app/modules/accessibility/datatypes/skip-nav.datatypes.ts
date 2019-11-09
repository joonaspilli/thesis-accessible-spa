import { Observable } from 'rxjs';

export interface SkipLink {
  anchorId: string;
  display?: Observable<boolean>;
  label: string;
  mediaQuery?: string;
}
