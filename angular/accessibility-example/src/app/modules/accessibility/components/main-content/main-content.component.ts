import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { onPathChange } from '@utilities';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { RoutePurposeService } from '../../services/route-purpose.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit, OnDestroy {

  private static readonly FOCUS_DEBOUNCE: number = 100;

  public readonly mainContentHeading$: Observable<string> =
    this.routePurposeService.mainHeading;

  private readonly destroyed$: Subject<boolean> = new Subject();
  @ViewChild('mainContentHeadingEl', { static: true })
    private readonly mainContentHeadingEl: ElementRef;

  constructor(
    private readonly routePurposeService: RoutePurposeService,
    private readonly router: Router
  ) { }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  public ngOnInit(): void {
    onPathChange(this.router).pipe(
      takeUntil(this.destroyed$),
      withLatestFrom(this.router.events),
      filter(([ route, routerEvent ]: [ ActivatedRoute, Event ]) => (
        routerEvent instanceof NavigationEnd && routerEvent.id > 1)
      ),
      /**
       * Some screen reader + browser combinations will read the previous
       * heading value if there's no delay to focusing the header. With some
       * browsers and screen readers a detectChanges() call would work, but
       * using a debounce is more reliable.
       */
      debounceTime(MainContentComponent.FOCUS_DEBOUNCE)
    ).subscribe(() => this.mainContentHeadingEl.nativeElement.focus());
  }

}
